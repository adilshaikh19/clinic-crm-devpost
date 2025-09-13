const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => error.msg),
      statusCode: 400
    });
  }
  next();
};

const clinicRegistrationValidation = [
  body('clinicId')
    .notEmpty()
    .trim()
    .withMessage('Clinic ID is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Clinic ID must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Clinic ID can only contain letters and numbers'),
  body('clinicName').notEmpty().trim().withMessage('Clinic name is required'),
  body('address').notEmpty().trim().withMessage('Address is required'),
  body('contactInfo').notEmpty().trim().withMessage('Contact info is required'),
  body('adminName').notEmpty().trim().withMessage('Admin name is required'),
  body('adminEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('adminPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('clinicId').notEmpty().trim().withMessage('Clinic ID is required')
];

const userCreationValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['doctor', 'receptionist']).withMessage('Role must be doctor or receptionist'),
  body('phone').optional().isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  body('specialization').optional().trim(),
  body('licenseNumber').optional().trim(),
  body('qualifications').optional().trim(),
  body('experience').optional().isInt({ min: 0, max: 50 }).withMessage('Experience must be between 0 and 50 years')
];

module.exports = {
  handleValidationErrors,
  clinicRegistrationValidation,
  loginValidation,
  userCreationValidation
};