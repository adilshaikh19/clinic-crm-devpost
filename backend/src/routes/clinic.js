const express = require('express');
const Clinic = require('../models/Clinic');
const { authenticateToken } = require('../middleware/auth');
const { ensureClinicIsolation } = require('../middleware/clinicIsolation');

const router = express.Router();

// Apply authentication and clinic isolation to all routes
router.use(authenticateToken);
router.use(ensureClinicIsolation);

// Get clinic data
router.get('/', async (req, res) => {
    try {
        const clinic = await Clinic.findOne({ clinicId: req.user.clinicId });

        if (!clinic) {
            return res.status(404).json({
                success: false,
                message: 'Clinic not found',
                statusCode: 404
            });
        }

        res.json({
            success: true,
            data: clinic
        });

    } catch (error) {
        console.error('Error fetching clinic data:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
});

module.exports = router;
