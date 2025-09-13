const express = require("express");
const Patient = require("../models/Patient");
const User = require("../models/User");
const Prescription = require("../models/Prescription");
const { authenticateToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");
const { ensureClinicIsolation } = require("../middleware/clinicIsolation");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Apply authentication and clinic isolation to all routes
router.use(authenticateToken);
router.use(ensureClinicIsolation);

// Validation middleware
const patientValidation = [
  body("name").notEmpty().trim().withMessage("Patient name is required"),
  body("phone").optional({ checkFalsy: true }).trim(),
  body("dateOfBirth").optional({ checkFalsy: true }).isISO8601(),
  body("gender").optional({ checkFalsy: true }).isIn(["male", "female", "other"]),
  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => error.msg),
      statusCode: 400,
    });
  }
  next();
};

// Get all patients (admin and receptionist see all, doctors see only their assigned)
router.get(
  "/",
  requireRole(["clinic_admin", "doctor", "receptionist"]),
  async (req, res) => {
    try {
      let query = { clinicId: req.user.clinicId };
      if (req.user.role === "doctor") {
        query.assignedDoctorId = req.user.userId;
      }

      const patients = await Patient.find(query)
        .populate("assignedDoctorId", "name email specialization")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: patients.map((patient) => ({
          _id: patient._id,
          patientId: patient.patientId,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          address: patient.address,
          emergencyContact: patient.emergencyContact,
          medicalHistory: patient.medicalHistory,
          assignedDoctor: patient.assignedDoctorId,
          createdAt: patient.createdAt,
          updatedAt: patient.updatedAt,
        })),
      });
    } catch (error) {
      console.error("Error fetching patients:", error);
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

// Create new patient (admin, receptionist, doctor)
router.post(
  "/",
  requireRole(["clinic_admin", "receptionist", "doctor"]),
  patientValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        dateOfBirth,
        gender,
        address,
        emergencyContact,
        medicalHistory,
        assignedDoctorId,
      } = req.body;

      // Generate unique patient ID
      const patientId = `PAT-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      // Determine assigned doctor
      let doctorId;
      if (req.user.role === "doctor") {
        doctorId = req.user.userId; // auto-assign
      } else if (
        (req.user.role === "clinic_admin" ||
          req.user.role === "receptionist") &&
        assignedDoctorId
      ) {
        const doctor = await User.findOne({
          _id: assignedDoctorId,
          clinicId: req.user.clinicId,
          role: "doctor",
        });
        if (!doctor) {
          return res
            .status(400)
            .json({
              success: false,
              message: "Invalid doctor assignment",
              statusCode: 400,
            });
        }
        doctorId = assignedDoctorId;
      } else {
        return res
          .status(400)
          .json({
            success: false,
            message: "Doctor assignment is required",
            statusCode: 400,
          });
      }

      const patientData = {
        clinicId: req.user.clinicId,
        assignedDoctorId: doctorId,
        patientId,
        name,
        email: email || null,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        address: address || {},
        emergencyContact: emergencyContact || {},
        medicalHistory: medicalHistory || {},
      };

      const newPatient = new Patient(patientData);
      await newPatient.save();

      await newPatient.populate(
        "assignedDoctorId",
        "name email specialization"
      );

      res.status(201).json({
        success: true,
        message: "Patient created successfully",
        data: {
          _id: newPatient._id,
          patientId: newPatient.patientId,
          name: newPatient.name,
          email: newPatient.email,
          phone: newPatient.phone,
          dateOfBirth: newPatient.dateOfBirth,
          gender: newPatient.gender,
          address: newPatient.address,
          emergencyContact: newPatient.emergencyContact,
          medicalHistory: newPatient.medicalHistory,
          assignedDoctor: newPatient.assignedDoctorId,
          createdAt: newPatient.createdAt,
        },
      });
    } catch (error) {
      console.error("Error creating patient:", error);
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

// Get patient by ID
router.get(
  "/:id",
  requireRole(["clinic_admin", "doctor", "receptionist"]),
  async (req, res) => {
    try {
      let query = { _id: req.params.id, clinicId: req.user.clinicId };
      if (req.user.role === "doctor") {
        query.assignedDoctorId = req.user.userId;
      }

      const patient = await Patient.findOne(query).populate(
        "assignedDoctorId",
        "name email specialization"
      );
      if (!patient) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Patient not found",
            statusCode: 404,
          });
      }

      res.json({
        success: true,
        data: {
          _id: patient._id,
          patientId: patient.patientId,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          address: patient.address,
          emergencyContact: patient.emergencyContact,
          medicalHistory: patient.medicalHistory,
          assignedDoctor: patient.assignedDoctorId,
          createdAt: patient.createdAt,
          updatedAt: patient.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error fetching patient:", error);
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

// Update patient
router.put(
  "/:id",
  requireRole(["clinic_admin", "doctor", "receptionist"]),
  async (req, res) => {
    try {
      let query = { _id: req.params.id, clinicId: req.user.clinicId };
      if (req.user.role === "doctor") {
        query.assignedDoctorId = req.user.userId;
      }

      const patient = await Patient.findOne(query);
      if (!patient) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Patient not found",
            statusCode: 404,
          });
      }

      const {
        name,
        email,
        phone,
        dateOfBirth,
        gender,
        address,
        emergencyContact,
        medicalHistory,
        assignedDoctorId,
      } = req.body;
      if (name) patient.name = name;
      if (email !== undefined) patient.email = email;
      if (phone) patient.phone = phone;
      if (dateOfBirth) patient.dateOfBirth = new Date(dateOfBirth);
      if (gender) patient.gender = gender;
      if (address) patient.address = { ...patient.address, ...address };
      if (emergencyContact)
        patient.emergencyContact = {
          ...patient.emergencyContact,
          ...emergencyContact,
        };
      if (medicalHistory)
        patient.medicalHistory = {
          ...patient.medicalHistory,
          ...medicalHistory,
        };

      // Only admin or receptionist can reassign
      if (
        (req.user.role === "clinic_admin" ||
          req.user.role === "receptionist") &&
        assignedDoctorId
      ) {
        const doctor = await User.findOne({
          _id: assignedDoctorId,
          clinicId: req.user.clinicId,
          role: "doctor",
        });
        if (doctor) {
          patient.assignedDoctorId = assignedDoctorId;
        }
      }

      await patient.save();
      await patient.populate("assignedDoctorId", "name email specialization");

      res.json({
        success: true,
        message: "Patient updated successfully",
        data: {
          _id: patient._id,
          patientId: patient.patientId,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          address: patient.address,
          emergencyContact: patient.emergencyContact,
          medicalHistory: patient.medicalHistory,
          assignedDoctor: patient.assignedDoctorId,
          updatedAt: patient.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error updating patient:", error);
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

// Delete patient (admin, receptionist)
router.delete(
  "/:id",
  requireRole(["clinic_admin", "receptionist"]),
  async (req, res) => {
    try {
      const patient = await Patient.findOneAndDelete({
        _id: req.params.id,
        clinicId: req.user.clinicId,
      });
      if (!patient) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Patient not found",
            statusCode: 404,
          });
      }
      res.json({ success: true, message: "Patient deleted successfully" });
    } catch (error) {
      console.error("Error deleting patient:", error);
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

// Get doctors list (for patient assignment)
router.get(
  "/doctors/list",
  requireRole(["clinic_admin", "receptionist"]),
  async (req, res) => {
    try {
      const doctors = await User.find({
        clinicId: req.user.clinicId,
        role: "doctor",
      }).select("name email specialization");
      res.json({ success: true, data: doctors });
    } catch (error) {
      console.error("Error fetching doctors:", error);
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

// Get patient prescriptions
router.get(
  "/:id/prescriptions",
  requireRole(["clinic_admin", "doctor", "receptionist"]),
  async (req, res) => {
    try {
      const patientFilter = { _id: req.params.id, clinicId: req.user.clinicId };
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
        patientId: String(req.params.id),
      }).sort({ createdAt: -1 }).lean();

      // Get unique doctor IDs and fetch doctor information
      const doctorIds = [...new Set(prescriptions.map(p => p.doctorId))];
      const doctors = await User.find({ userId: { $in: doctorIds } });
      const doctorMap = doctors.reduce((acc, doc) => {
        acc[doc.userId] = doc;
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

module.exports = router;
