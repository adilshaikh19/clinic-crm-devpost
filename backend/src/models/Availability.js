const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  date: { type: Date, required: true },
  slots: [{
    startTime: { type: String, required: true }, // e.g., "09:00"
    endTime: { type: String, required: true },   // e.g., "09:30"
    isBooked: { type: Boolean, default: false }
  }],
}, { timestamps: true });

// To ensure a doctor has only one availability document per day per clinic
availabilitySchema.index({ doctor: 1, clinic: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Availability', availabilitySchema);
