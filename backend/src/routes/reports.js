const express = require('express');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { ensureClinicIsolation } = require('../middleware/clinicIsolation');

const router = express.Router();

// Apply authentication and clinic isolation to all routes
router.use(authenticateToken);
router.use(ensureClinicIsolation);

// Dashboard statistics
router.get('/dashboard-stats', requireRole(['clinic_admin', 'doctor', 'receptionist']), async (req, res) => {
    try {
        const clinicId = req.user.clinicId;
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Basic counts
        const totalPatients = await Patient.countDocuments({ clinicId });
        const totalDoctors = await User.countDocuments({ clinicId, role: 'doctor', isActive: true });
        const totalAppointments = await Appointment.countDocuments({ clinicId });
        const totalPrescriptions = await Prescription.countDocuments({ clinicId });

        // Today's stats
        const todayAppointments = await Appointment.countDocuments({
            clinicId,
            date: { $gte: startOfDay, $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000) }
        });

        // This week's stats
        const weekAppointments = await Appointment.countDocuments({
            clinicId,
            date: { $gte: startOfWeek }
        });

        // This month's stats
        const monthAppointments = await Appointment.countDocuments({
            clinicId,
            date: { $gte: startOfMonth }
        });

        const monthPatients = await Patient.countDocuments({
            clinicId,
            createdAt: { $gte: startOfMonth }
        });

        // Appointment status distribution
        const appointmentsByStatus = await Appointment.aggregate([
            { $match: { clinicId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Recent appointments (last 7 days)
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        
        const dailyAppointments = await Appointment.aggregate([
            {
                $match: {
                    clinicId,
                    date: { $gte: last7Days }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalPatients,
                    totalDoctors,
                    totalAppointments,
                    totalPrescriptions,
                    todayAppointments,
                    weekAppointments,
                    monthAppointments,
                    monthPatients
                },
                appointmentsByStatus,
                dailyAppointments
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
});

// Appointments report
router.get('/appointments', requireRole(['clinic_admin', 'doctor', 'receptionist']), async (req, res) => {
    try {
        const { startDate, endDate, status, doctorId } = req.query;
        const filter = { clinicId: req.user.clinicId };

        // Date range filter
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        // Status filter
        if (status) filter.status = status;

        // Doctor filter
        if (doctorId) filter.doctorId = doctorId;

        // Role-based filtering
        if (req.user.role === 'doctor') {
            filter.doctorId = req.user.userId;
        }

        const appointments = await Appointment.find(filter)
            .populate('patientId', 'name phone email')
            .populate('doctorId', 'name specialization')
            .sort({ date: -1, time: -1 });

        // Generate summary statistics
        const summary = {
            total: appointments.length,
            byStatus: {},
            byDoctor: {}
        };

        appointments.forEach(apt => {
            // Count by status
            summary.byStatus[apt.status] = (summary.byStatus[apt.status] || 0) + 1;
            
            // Count by doctor
            const doctorName = apt.doctorId?.name || 'Unknown';
            summary.byDoctor[doctorName] = (summary.byDoctor[doctorName] || 0) + 1;
        });

        res.json({
            success: true,
            data: {
                appointments,
                summary
            }
        });

    } catch (error) {
        console.error('Error fetching appointments report:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
});

// Patients report
router.get('/patients', requireRole(['clinic_admin', 'doctor', 'receptionist']), async (req, res) => {
    try {
        const { startDate, endDate, doctorId, gender } = req.query;
        const filter = { clinicId: req.user.clinicId };

        // Date range filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Doctor filter
        if (doctorId) filter.assignedDoctorId = doctorId;

        // Gender filter
        if (gender) filter.gender = gender;

        // Role-based filtering
        if (req.user.role === 'doctor') {
            filter.assignedDoctorId = req.user.userId;
        }

        const patients = await Patient.find(filter)
            .populate('assignedDoctorId', 'name specialization')
            .sort({ createdAt: -1 });

        // Generate summary statistics
        const summary = {
            total: patients.length,
            byGender: {},
            byDoctor: {},
            byAgeGroup: {
                '0-18': 0,
                '19-35': 0,
                '36-50': 0,
                '51-65': 0,
                '65+': 0
            }
        };

        const currentDate = new Date();

        patients.forEach(patient => {
            // Count by gender
            if (patient.gender) {
                summary.byGender[patient.gender] = (summary.byGender[patient.gender] || 0) + 1;
            }
            
            // Count by doctor
            const doctorName = patient.assignedDoctorId?.name || 'Unassigned';
            summary.byDoctor[doctorName] = (summary.byDoctor[doctorName] || 0) + 1;

            // Count by age group
            if (patient.dateOfBirth) {
                const age = Math.floor((currentDate - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000));
                if (age <= 18) summary.byAgeGroup['0-18']++;
                else if (age <= 35) summary.byAgeGroup['19-35']++;
                else if (age <= 50) summary.byAgeGroup['36-50']++;
                else if (age <= 65) summary.byAgeGroup['51-65']++;
                else summary.byAgeGroup['65+']++;
            }
        });

        res.json({
            success: true,
            data: {
                patients,
                summary
            }
        });

    } catch (error) {
        console.error('Error fetching patients report:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
});

// Prescriptions report
router.get('/prescriptions', requireRole(['clinic_admin', 'doctor', 'receptionist']), async (req, res) => {
    try {
        const { startDate, endDate, doctorId, patientId } = req.query;
        const filter = { clinicId: req.user.clinicId };

        // Date range filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Doctor filter
        if (doctorId) filter.doctorId = doctorId;

        // Patient filter
        if (patientId) filter.patientId = patientId;

        // Role-based filtering
        if (req.user.role === 'doctor') {
            filter.doctorId = req.user.userId;
        }

        const prescriptions = await Prescription.find(filter)
            .populate('patientId', 'name phone email')
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 });

        // Generate summary statistics
        const summary = {
            total: prescriptions.length,
            byDoctor: {},
            medicationFrequency: {}
        };

        prescriptions.forEach(prescription => {
            // Count by doctor
            const doctorName = prescription.doctorId?.name || 'Unknown';
            summary.byDoctor[doctorName] = (summary.byDoctor[doctorName] || 0) + 1;

            // Count medication frequency
            prescription.medications.forEach(med => {
                summary.medicationFrequency[med.name] = (summary.medicationFrequency[med.name] || 0) + 1;
            });
        });

        res.json({
            success: true,
            data: {
                prescriptions,
                summary
            }
        });

    } catch (error) {
        console.error('Error fetching prescriptions report:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
});

// Revenue report (if you have billing data)
router.get('/revenue', requireRole(['clinic_admin']), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const currentDate = new Date();
        const last12Months = new Date();
        last12Months.setMonth(last12Months.getMonth() - 12);

        // For now, we'll simulate revenue data based on appointments
        // In a real system, you'd have a billing/payment model
        const filter = { 
            clinicId: req.user.clinicId,
            status: 'completed',
            date: { $gte: startDate ? new Date(startDate) : last12Months }
        };

        if (endDate) filter.date.$lte = new Date(endDate);

        const completedAppointments = await Appointment.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { 
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Simulate revenue (in a real app, this would come from billing data)
        const revenueData = completedAppointments.map(item => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            appointments: item.count,
            revenue: item.count * 100 // Assuming $100 per appointment
        }));

        res.json({
            success: true,
            data: {
                revenueData,
                totalRevenue: revenueData.reduce((sum, item) => sum + item.revenue, 0),
                totalAppointments: revenueData.reduce((sum, item) => sum + item.appointments, 0)
            }
        });

    } catch (error) {
        console.error('Error fetching revenue report:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
});

module.exports = router;