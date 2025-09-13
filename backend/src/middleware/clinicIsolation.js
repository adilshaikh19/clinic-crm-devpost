const ensureClinicIsolation = (req, res, next) => {
  if (!req.user || !req.user.clinicId) {
    return res.status(401).json({
      success: false,
      message: 'Clinic context required',
      statusCode: 401
    });
  }

  // Add clinic filter to query operations
  req.clinicFilter = { clinicId: req.user.clinicId };
  
  next();
};

module.exports = {
  ensureClinicIsolation
};