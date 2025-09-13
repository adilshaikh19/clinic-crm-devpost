const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const { authenticateToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");
const { ensureClinicIsolation } = require("../middleware/clinicIsolation");

// @route   POST /api/availability
// @desc    Create or update doctor availability
// @access  Private (Doctor)
router.post('/', [authenticateToken, ensureClinicIsolation, requireRole(['doctor'])], async (req, res) => {
    const { date, slots } = req.body;
    const doctorId = req.user.id;
    const clinicId = req.user.clinic;

    try {
        let availability = await Availability.findOne({ doctor: doctorId, clinic: clinicId, date });

        if (availability) {
            // Update existing availability
            availability.slots = slots;
            await availability.save();
            return res.json(availability);
        }

        // Create new availability
        availability = new Availability({
            doctor: doctorId,
            clinic: clinicId,
            date,
            slots
        });

        await availability.save();
        res.json(availability);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/availability/doctor/:doctorId
// @desc    Get availability for a doctor
// @access  Private
router.get('/doctor/:doctorId', [authenticateToken, ensureClinicIsolation], async (req, res) => {
    try {
        const availability = await Availability.find({ 
            doctor: req.params.doctorId,
            clinic: req.user.clinic,
            date: { $gte: new Date() } // Only get future availability
        }).sort({ date: 1 });

        res.json(availability);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
