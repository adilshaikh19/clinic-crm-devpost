const express = require('express');
const Clinic = require('../models/Clinic');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const { clinicRegistrationValidation, loginValidation, handleValidationErrors } = require('../utils/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register new clinic
router.post('/register-clinic', clinicRegistrationValidation, handleValidationErrors, async (req, res) => {
  try {
    const { clinicId, clinicName, address, contactInfo, adminName, adminEmail, adminPassword } = req.body;

    // Check if clinic ID already exists
    const existingClinic = await Clinic.findOne({ clinicId });
    if (existingClinic) {
      return res.status(400).json({
        success: false,
        message: 'Clinic ID already exists. Please choose a different one.',
        statusCode: 400
      });
    }

    // Check if admin email already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        statusCode: 400
      });
    }

    // Create clinic with user-provided clinic ID
    const clinic = new Clinic({
      clinicId,
      name: clinicName,
      address,
      contactInfo
    });

    await clinic.save();

    // Create admin user
    const hashedPassword = await hashPassword(adminPassword);
    const adminUser = new User({
      clinicId,
      name: adminName,
      email: adminEmail,
      passwordHash: hashedPassword,
      role: 'clinic_admin'
    });

    await adminUser.save();

    res.status(201).json({
      success: true,
      message: 'Clinic registered successfully',
      data: {
        clinicId,
        clinicName,
        adminEmail
      }
    });

  } catch (error) {
    console.error('Clinic registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      statusCode: 500
    });
  }
});

// Check clinic ID availability
router.get('/check-clinic-id/:clinicId', async (req, res) => {
  try {
    const { clinicId } = req.params;

    // Validate clinic ID format
    if (!/^[a-zA-Z0-9]+$/.test(clinicId) || clinicId.length < 3 || clinicId.length > 20) {
      return res.status(400).json({
        success: false,
        message: 'Clinic ID must be 3-20 characters and contain only letters and numbers',
        statusCode: 400
      });
    }

    const existingClinic = await Clinic.findOne({ clinicId });

    res.json({
      success: true,
      available: !existingClinic,
      message: existingClinic ? 'Clinic ID is already taken' : 'Clinic ID is available'
    });
  } catch (error) {
    console.error('Check clinic ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      statusCode: 500
    });
  }
});

// Debug route to check users (remove in production)
router.get('/debug/users', async (req, res) => {
  try {
    const users = await User.find({}).select('email clinicId role name');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login
router.post('/login', loginValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email, password, clinicId } = req.body;

    // Find user with matching email and clinicId
    const user = await User.findOne({ email, clinicId });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        statusCode: 401
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        statusCode: 401
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User is deactivated',
        statusCode: 401
      });
    }

    // Get clinic information
    const clinic = await Clinic.findOne({ clinicId: user.clinicId });

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      clinicId: user.clinicId,
      role: user.role,
      name: user.name
    });

    // Set cookie with proper configuration for production
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",  
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      domain: process.env.NODE_ENV === 'production' ? undefined : undefined // Let browser handle domain
    };

    console.log('Setting cookie with options:', cookieOptions);
    res.cookie('token', token, cookieOptions);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          clinicId: user.clinicId,
          clinicName: clinic?.name || 'Unknown Clinic'
        },
        token: token // Include token in response for Authorization header usage
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      statusCode: 500
    });
  }
});

// User logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        statusCode: 404
      });
    }
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          clinicId: user.clinicId
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      statusCode: 500
    });
  }
});

module.exports = router;