const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clinicId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['clinic_admin', 'doctor', 'receptionist'],
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  specialization: {
    type: String,
    trim: true
  },
  licenseNumber: {
    type: String,
    trim: true
  },
  qualifications: {
    type: String,
    trim: true
  },
  experience: {
    type: Number, // years of experience
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: { // Added this field
    type: Boolean,
    default: true
  }
});

// Compound index for email uniqueness within clinic
userSchema.index({ clinicId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);