const express = require("express");
const { body, validationResult } = require("express-validator");
const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");
const { ensureClinicIsolation } = require("../middleware/clinicIsolation");

const router = express.Router();

// Helpers
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => e.msg),
      statusCode: 400,
    });
  }
  next();
};

const createValidation = [
  body("patientId").notEmpty().withMessage("patientId is required"),
  body("medications")
    .isArray({ min: 1 })
    .withMessage("medications array is required"),
  body("medications.*.name")
    .notEmpty()
    .withMessage("medication name is required"),
  body("medications.*.dosage")
    .notEmpty()
    .withMessage("medication dosage is required"),
  body("medications.*.frequency")
    .notEmpty()
    .withMessage("medication frequency is required"),
  body("medications.*.duration")
    .notEmpty()
    .withMessage("medication duration is required"),
  body("notes").optional().isString(),
];

// Auth + isolation
router.use(authenticateToken);
router.use(ensureClinicIsolation);

// GET /prescriptions - list (admin, doctor); receptionist can view list but not create
router.get(
  "/",
  requireRole(["clinic_admin", "doctor", "receptionist"]),
  async (req, res) => {
    try {
      const filter = { clinicId: req.user.clinicId };
      if (req.user.role === "doctor") {
        filter.doctorId = String(req.user.userId);
      }

      const prescriptions = await Prescription.find(filter).sort({ createdAt: -1 }).lean();

      // Get unique doctor and patient IDs
      const doctorIds = [...new Set(prescriptions.map(p => p.doctorId))];
      const patientIds = [...new Set(prescriptions.map(p => p.patientId))];

      // Fetch doctors and patients
      const doctors = await User.find({ _id: { $in: doctorIds } });
      const patients = await Patient.find({ _id: { $in: patientIds } });

      // Create maps for quick lookup
      const doctorMap = doctors.reduce((acc, doc) => {
        acc[doc._id.toString()] = doc;
        return acc;
      }, {});

      const patientMap = patients.reduce((acc, patient) => {
        acc[patient._id.toString()] = patient;
        return acc;
      }, {});

      const list = prescriptions.map(p => ({
        ...p,
        doctor: doctorMap[p.doctorId],
        patient: patientMap[p.patientId]
      }));

      res.json({ success: true, data: list });
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          statusCode: 500,
        });
    }
  }
);

// POST /prescriptions - doctors and clinic admins
router.post(
  "/",
  requireRole(["doctor", "clinic_admin"]),
  createValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { patientId, medications, notes } = req.body;

      // Validate patient belongs to clinic and is assigned to this doctor (or allow any? enforce assignment)
      const patient = await Patient.findOne({
        _id: patientId,
        clinicId: req.user.clinicId,
      });
      if (!patient) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Invalid patient",
            statusCode: 400,
          });
      }

      // Optional: ensure doctor writes only for own patient (clinic admins can prescribe for any patient)
      if (req.user.role === "doctor" && String(patient.assignedDoctorId) !== String(req.user.userId)) {
        return res
          .status(403)
          .json({
            success: false,
            message: "You can only prescribe for your assigned patients",
            statusCode: 403,
          });
      }

      const prescriptionId = `PRX-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      const p = new Prescription({
        clinicId: req.user.clinicId,
        prescriptionId,
        patientId: String(patientId),
        doctorId: String(req.user.userId),
        medications,
        notes: notes || "",
      });

      await p.save();

      res
        .status(201)
        .json({ success: true, message: "Prescription created", data: p });
    } catch (error) {
      console.error("Error creating prescription:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          statusCode: 500,
        });
    }
  }
);

// GET /patients/:id/prescriptions - patient specific
// Note: This will be mounted in server.js through /prescriptions route only; we'll export route segment here for reuse in patients if needed
router.get(
  "/patient/:id",
  requireRole(["clinic_admin", "doctor", "receptionist"]),
  async (req, res) => {
    try {
      const patientId = req.params.id;
      // Receptionists and admins: any within clinic; Doctors: only own patients
      const patientFilter = { _id: patientId, clinicId: req.user.clinicId };
      if (req.user.role === "doctor") {
        patientFilter.assignedDoctorId = req.user.userId;
      }
      const patient = await Patient.findOne(patientFilter);
      if (!patient) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Patient not found",
            statusCode: 404,
          });
      }

      const prescriptions = await Prescription.find({
        clinicId: req.user.clinicId,
        patientId: String(patientId),
      }).sort({ createdAt: -1 }).lean();

      const doctorIds = [...new Set(prescriptions.map(p => p.doctorId))];
      const doctors = await User.find({ _id: { $in: doctorIds } });
      const doctorMap = doctors.reduce((acc, doc) => {
        acc[doc._id.toString()] = doc;
        return acc;
      }, {});

      const list = prescriptions.map(p => ({
        ...p,
        doctor: doctorMap[p.doctorId]
      }));

      res.json({ success: true, data: list });
    } catch (error) {
      console.error("Error fetching patient prescriptions:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          statusCode: 500,
        });
    }
  }
);


// GET /prescriptions/:id - get single prescription
router.get(
  "/:id",
  requireRole(["clinic_admin", "doctor", "receptionist"]),
  async (req, res) => {
    try {
      console.log(`Fetching prescription ${req.params.id} for user ${req.user.userId} with role ${req.user.role}`);
      
      const prescription = await Prescription.findOne({
        _id: req.params.id,
        clinicId: req.user.clinicId,
      }).lean();

      if (!prescription) {
        console.log(`Prescription ${req.params.id} not found for clinic ${req.user.clinicId}`);
        return res
          .status(404)
          .json({
            success: false,
            message: "Prescription not found",
            statusCode: 404,
          });
      }

      console.log(`Found prescription, looking for patient ${prescription.patientId}`);

      // Get patient data
      const patient = await Patient.findOne({
        _id: prescription.patientId,
        clinicId: req.user.clinicId,
      });

      if (!patient) {
        console.log(`Patient ${prescription.patientId} not found for clinic ${req.user.clinicId}`);
        return res
          .status(404)
          .json({
            success: false,
            message: "Patient not found",
            statusCode: 404,
          });
      }

      console.log(`Found patient, assigned doctor: ${patient.assignedDoctorId}, current user: ${req.user.userId}`);

      // If user is a doctor, ensure they can only access their own patient's prescriptions
      // Clinic admins and receptionists can access all prescriptions
      if (req.user.role === "doctor" && String(patient.assignedDoctorId) !== String(req.user.userId)) {
        console.log(`Doctor ${req.user.userId} trying to access prescription for patient assigned to ${patient.assignedDoctorId}`);
        return res
          .status(403)
          .json({
            success: false,
            message: "You are not authorized to view this prescription",
            statusCode: 403,
          });
      }
      
      const doctor = await User.findOne({ _id: prescription.doctorId });
      
      // Include patient and doctor data in response
      prescription.patient = patient;
      if (doctor) {
        prescription.doctor = doctor;
      }

      console.log(`Successfully returning prescription data`);
      res.json({ success: true, data: prescription });
    } catch (error) {
      console.error("Error fetching prescription:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          statusCode: 500,
        });
    }
  }
);

module.exports = router;

