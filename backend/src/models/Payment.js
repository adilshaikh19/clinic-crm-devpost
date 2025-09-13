const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  clinicId: {
    type: String,
    required: true,
    index: true
  },
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: false
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'insurance', 'bank_transfer', 'check', 'online'],
    required: true
  },
  paymentType: {
    type: String,
    enum: ['consultation', 'procedure', 'medication', 'lab_test', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    trim: true
  },
  invoiceNumber: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date
  },
  paidDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound index for efficient queries
paymentSchema.index({ clinicId: 1, patientId: 1 });
paymentSchema.index({ clinicId: 1, status: 1 });
paymentSchema.index({ clinicId: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);