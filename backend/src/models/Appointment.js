const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  clinicId: {
    type: String,
    required: true,
    index: true
  },
  appointmentId: {
    type: String,
    unique: true,
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: false // Make patientId optional for temporary patients
  },
  // Direct patient details (if patientId is not provided)
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  emergencyContact: {
    name: { type: String, trim: true },
    relationship: { type: String, trim: true },
    phone: { type: String, trim: true }
  },
  medicalHistory: {
    allergies: [{ type: String, trim: true }],
    chronicConditions: [{ type: String, trim: true }],
    currentMedications: [{ type: String, trim: true }],
    bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''] },
    notes: { type: String, trim: true }
  },
  assignedDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, can be assigned later
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'registered'], // Added 'registered' status
    default: 'scheduled'
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);