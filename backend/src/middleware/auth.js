const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    // Try to get token from Authorization header first, then fallback to cookies
    let token = null;
    
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('Auth middleware - Token found in Authorization header');
    } else {
      // Fallback to cookies
      token = req.cookies.token;
      console.log('Auth middleware - cookies received:', Object.keys(req.cookies));
      console.log('Auth middleware - token present in cookies:', !!token);
    }

    if (!token) {
      console.log('Auth middleware - No token found in Authorization header or cookies');
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        statusCode: 401
      });
    }

    const decoded = verifyToken(token);
    console.log('Auth middleware - Token decoded successfully for user:', decoded.userId);
    
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('Auth middleware - User not found for ID:', decoded.userId);
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        statusCode: 401
      });
    }

    if (!user.isActive) {
      console.log('Auth middleware - User is inactive:', user.email);
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated',
        statusCode: 401
      });
    }

    req.user = {
      _id: user._id,
      userId: user._id.toString(),
      clinicId: user.clinicId.toString(),
      role: user.role,
      name: user.name,
      email: user.email
    };

    console.log('Auth middleware - User authenticated:', user.email, user.role);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      statusCode: 401
    });
  }
};

module.exports = {
  authenticateToken
};