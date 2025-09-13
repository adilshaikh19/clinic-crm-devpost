const express = require('express');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { ensureClinicIsolation } = require('../middleware/clinicIsolation');

const router = express.Router();

// Helpers
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => e.msg),
      statusCode: 400,
    });
  }
  next();
};

const paymentValidation = [
  body('patientId').isMongoId().withMessage('Valid patient ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('paymentMethod').isIn(['cash', 'card', 'insurance', 'bank_transfer', 'check', 'online']).withMessage('Invalid payment method'),
  body('paymentType').isIn(['consultation', 'procedure', 'medication', 'lab_test', 'other']).withMessage('Invalid payment type'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('invoiceNumber').optional().isString().withMessage('Invoice number must be a string'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
];

// Apply authentication and clinic isolation to all routes
router.use(authenticateToken);
router.use(ensureClinicIsolation);

// GET /payments - Get all payments
router.get('/', requireRole(['clinic_admin', 'receptionist']), async (req, res) => {
  try {
    const { patientId, status, paymentMethod, startDate, endDate } = req.query;
    const filter = { clinicId: req.user.clinicId };

    // Apply filters
    if (patientId) filter.patientId = patientId;
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(filter)
      .populate('patientId', 'name phone email patientId')
      .populate('appointmentId', 'date time')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      statusCode: 500
    });
  }
});

// GET /payments/patient/:patientId - Get payments for a specific patient
router.get('/patient/:patientId', requireRole(['clinic_admin', 'doctor', 'receptionist']), async (req, res) => {
  try {
    const { patientId } = req.params;

    // Verify patient belongs to clinic
    const patient = await Patient.findOne({
      _id: patientId,
      clinicId: req.user.clinicId
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        statusCode: 404
      });
    }

    // Role-based filtering for doctors
    if (req.user.role === 'doctor' && patient.assignedDoctorId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        statusCode: 403
      });
    }

    const payments = await Payment.find({
      clinicId: req.user.clinicId,
      patientId: patientId
    })
      .populate('appointmentId', 'date time')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    // Calculate summary
    const summary = {
      total: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      paidAmount: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
      pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
      byStatus: {},
      byPaymentMethod: {}
    };

    payments.forEach(payment => {
      summary.byStatus[payment.status] = (summary.byStatus[payment.status] || 0) + 1;
      summary.byPaymentMethod[payment.paymentMethod] = (summary.byPaymentMethod[payment.paymentMethod] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        payments,
        summary
      }
    });

  } catch (error) {
    console.error('Error fetching patient payments:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      statusCode: 500
    });
  }
});

// POST /payments - Create new payment
router.post('/', requireRole(['clinic_admin', 'receptionist']), paymentValidation, handleValidationErrors, async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      amount,
      currency = 'USD',
      paymentMethod,
      paymentType,
      description,
      invoiceNumber,
      dueDate,
      notes
    } = req.body;

    // Verify patient belongs to clinic
    const patient = await Patient.findOne({
      _id: patientId,
      clinicId: req.user.clinicId
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        statusCode: 404
      });
    }

    // Verify appointment if provided
    if (appointmentId) {
      const appointment = await Appointment.findOne({
        _id: appointmentId,
        clinicId: req.user.clinicId,
        patientId: patientId
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
          statusCode: 404
        });
      }
    }

    // Generate unique payment ID
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const payment = new Payment({
      clinicId: req.user.clinicId,
      paymentId,
      patientId,
      appointmentId: appointmentId || null,
      amount,
      currency,
      paymentMethod,
      paymentType,
      description: description || '',
      invoiceNumber: invoiceNumber || '',
      dueDate: dueDate ? new Date(dueDate) : null,
      notes: notes || '',
      createdBy: req.user.userId,
      status: paymentMethod === 'cash' ? 'completed' : 'pending'
    });

    // Set paid date if payment is completed
    if (payment.status === 'completed') {
      payment.paidDate = new Date();
    }

    await payment.save();

    // Populate the response
    await payment.populate('patientId', 'name phone email patientId');
    await payment.populate('appointmentId', 'date time');
    await payment.populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      statusCode: 500
    });
  }
});

// PUT /payments/:id - Update payment
router.put('/:id', requireRole(['clinic_admin', 'receptionist']), async (req, res) => {
  try {
    const { status, paidDate, notes } = req.body;

    const payment = await Payment.findOne({
      _id: req.params.id,
      clinicId: req.user.clinicId
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
        statusCode: 404
      });
    }

    // Update fields
    if (status && ['pending', 'completed', 'failed', 'refunded', 'cancelled'].includes(status)) {
      payment.status = status;
      
      // Set paid date when marking as completed
      if (status === 'completed' && !payment.paidDate) {
        payment.paidDate = paidDate ? new Date(paidDate) : new Date();
      }
      
      // Clear paid date if not completed
      if (status !== 'completed') {
        payment.paidDate = null;
      }
    }

    if (notes !== undefined) payment.notes = notes;

    await payment.save();

    // Populate the response
    await payment.populate('patientId', 'name phone email patientId');
    await payment.populate('appointmentId', 'date time');
    await payment.populate('createdBy', 'name');

    res.json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    });

  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      statusCode: 500
    });
  }
});

// DELETE /payments/:id - Delete payment
router.delete('/:id', requireRole(['clinic_admin']), async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({
      _id: req.params.id,
      clinicId: req.user.clinicId
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
        statusCode: 404
      });
    }

    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      statusCode: 500
    });
  }
});

module.exports = router;