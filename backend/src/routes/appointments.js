const express = require("express");
const { body, validationResult } = require("express-validator");
const Appointment = require("../models/Appointment");
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
  body("doctorId").notEmpty().withMessage("doctorId is required"),
  body("date").isISO8601().withMessage("Valid date is required"),
  body("time").notEmpty().withMessage("time is required"),
  body("notes").optional({ checkFalsy: true }).isString().withMessage("notes must be a string"),
  // Either patientId OR direct patient details must be provided
  body("patientId")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("patientId must be a valid id"),
  body("name")
    .if(body("patientId").not().exists())
    .notEmpty()
    .withMessage("Patient name is required when patientId is not provided"),
  body("phone")
    .optional({ checkFalsy: true }),
  // Optional patient details
  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Patient email must be a valid email"),
  body("dateOfBirth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Patient date of birth must be a valid date"),
  body("gender")
    .optional({ checkFalsy: true })
    .isIn(["male", "female", "other"])
    .withMessage("Patient gender must be male, female, or other"),
  // Optional address fields
  body("address.street").optional({ checkFalsy: true }).isString(),
  body("address.city").optional({ checkFalsy: true }).isString(),
  body("address.state").optional({ checkFalsy: true }).isString(),
  body("address.zipCode").optional({ checkFalsy: true }).isString(),
  body("address.country").optional({ checkFalsy: true }).isString(),
  // Optional emergency contact fields
  body("emergencyContact.name").optional({ checkFalsy: true }).isString(),
  body("emergencyContact.relationship").optional({ checkFalsy: true }).isString(),
  body("emergencyContact.phone").optional({ checkFalsy: true }).isString(),
  // Optional medical history fields (already handled by schema)
];

// Auth + clinic isolation
router.use(authenticateToken);
router.use(ensureClinicIsolation);

// GET /appointments - list appointments
router.get(
  "/",
  requireRole(["clinic_admin", "doctor", "receptionist"]),
  async (req, res) => {
    try {
      const filter = { clinicId: req.user.clinicId };

      // Doctors see only own appointments
      if (req.user.role === "doctor") {
        filter.doctorId = String(req.user.userId);
      }

      const appointments = await Appointment.find(filter)
        .populate("patientId", "name")
        .populate("doctorId", "name")
        .sort({
          date: 1,
          time: 1,
        });

      res.json({ success: true, data: appointments });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        statusCode: 500,
      });
    }
  }
);

// POST /appointments - create appointment (admin, receptionist). Doctors may also create for themselves.
router.post(
  "/",
  requireRole(["clinic_admin", "receptionist", "doctor"]),
  createValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        patientId,
        doctorId,
        date,
        time,
        notes,
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

      // Validate doctor belongs to clinic and is doctor
      const doctor = await User.findOne({
        _id: doctorId,
        clinicId: req.user.clinicId,
        role: "doctor",
      });
      if (!doctor) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid doctor", statusCode: 400 });
      }

      // If role is doctor, enforce that doctor creates only for self
      if (
        req.user.role === "doctor" &&
        String(req.user.userId) !== String(doctorId)
      ) {
        return res.status(403).json({
          success: false,
          message: "Doctors can only create their own appointments",
          statusCode: 403,
        });
      }

      // If patientId is provided, verify it belongs to the same clinic and exists
      let finalPatientId = null;
      if (patientId) {
        const existingPatient = await Patient.findOne({
          _id: patientId,
          clinicId: req.user.clinicId,
        });
        if (!existingPatient) {
          return res
            .status(400)
            .json({
              success: false,
              message: "Invalid patient",
              statusCode: 400,
            });
        }
        finalPatientId = existingPatient._id;
      }

      const appointmentId = `APT-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      const appt = new Appointment({
        clinicId: req.user.clinicId,
        appointmentId,
        patientId: finalPatientId, // If provided, set it. Otherwise keep null for temp appointment
        name: finalPatientId ? undefined : name,
        email: finalPatientId ? undefined : email,
        phone: finalPatientId ? undefined : phone,
        dateOfBirth: finalPatientId ? undefined : (dateOfBirth ? new Date(dateOfBirth) : null),
        gender: finalPatientId ? undefined : gender,
        address: finalPatientId ? undefined : address,
        emergencyContact: finalPatientId ? undefined : emergencyContact,
        medicalHistory: finalPatientId ? undefined : medicalHistory,
        assignedDoctorId: finalPatientId ? undefined : assignedDoctorId,
        doctorId: String(doctorId),
        date: new Date(date),
        time,
        notes: notes || "",
        status: finalPatientId ? "scheduled" : "scheduled", // both scheduled; temp patient remains until registered via PUT
      });

      await appt.save();

      res
        .status(201)
        .json({ success: true, message: "Appointment created", data: appt });
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        statusCode: 500,
      });
    }
  }
);

// GET /appointments/:id - get one
router.get(
  "/:id",
  requireRole(["clinic_admin", "doctor", "receptionist"]),
  async (req, res) => {
    try {
      const filter = { _id: req.params.id, clinicId: req.user.clinicId };
      if (req.user.role === "doctor") {
        filter.doctorId = String(req.user.userId);
      }

      const appt = await Appointment.findOne(filter)
        .populate("patientId", "name")
        .populate("doctorId", "name");
      if (!appt) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
          statusCode: 404,
        });
      }

      res.json({ success: true, data: appt });
    } catch (error) {
      console.error("Error fetching appointment:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        statusCode: 500,
      });
    }
  }
);

// PUT /appointments/:id - update appointment
router.put(
  "/:id",
  requireRole(["clinic_admin", "receptionist", "doctor"]),
  async (req, res) => {
    try {
      const filter = { _id: req.params.id, clinicId: req.user.clinicId };
      if (req.user.role === "doctor") {
        filter.doctorId = String(req.user.userId);
      }

      const appt = await Appointment.findOne(filter);
      if (!appt) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
          statusCode: 404,
        });
      }

      const { date, time, status, notes } = req.body;

      // Handle status change to 'registered' for temporary patients
      if (
        status === "registered" &&
        !appt.patientId &&
        appt.name
      ) {
        try {
          // Check if a patient with this phone number already exists in the clinic
          let existingPatient = null;
          if (appt.phone) {
            existingPatient = await Patient.findOne({
              clinicId: req.user.clinicId,
              phone: appt.phone,
            });
          }

          if (existingPatient) {
            // If patient exists, link to existing patient and clear temporary patient data
            appt.patientId = existingPatient._id;
            appt.name = undefined;
            appt.email = undefined;
            appt.phone = undefined;
            appt.dateOfBirth = undefined;
            appt.gender = undefined;
            appt.address = undefined;
            appt.emergencyContact = undefined;
            appt.medicalHistory = undefined;
            appt.assignedDoctorId = undefined;
            appt.status = "registered";
            await appt.save();
            return res.json({
              success: true,
              message: "Appointment updated and linked to existing patient",
              data: appt,
            });
          }

          // Generate a unique patientId for the new patient
          const newPatientId = `PAT-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase()}`;

          console.log(
            "Attempting to create new patient from appointment data:",
            {
              clinicId: req.user.clinicId,
              name: appt.name,
              email: appt.email,
              phone: appt.phone,
              dateOfBirth: appt.dateOfBirth,
              gender: appt.gender,
              address: appt.address,
              emergencyContact: appt.emergencyContact,
              medicalHistory: appt.medicalHistory,
              assignedDoctorId: appt.doctorId,
            }
          );

          const newPatient = new Patient({
            clinicId: req.user.clinicId,
            patientId: newPatientId,
            name: appt.name,
            email: appt.email,
            phone: appt.phone || null,
            dateOfBirth: appt.dateOfBirth,
            gender: appt.gender,
            address: appt.address,
            emergencyContact: appt.emergencyContact,
            medicalHistory: appt.medicalHistory,
            assignedDoctorId: appt.doctorId, // Assign the doctor from the appointment
          });

          await newPatient.save();
          console.log("New patient saved successfully:", newPatient);

          // Link the new patient to the appointment and clear temporary patient data
          appt.patientId = newPatient._id;
          appt.name = undefined;
          appt.email = undefined;
          appt.phone = undefined;
          appt.dateOfBirth = undefined;
          appt.gender = undefined;
          appt.address = undefined;
          appt.emergencyContact = undefined;
          appt.medicalHistory = undefined;
          appt.assignedDoctorId = undefined;
          appt.status = "registered";

          await appt.save();
          console.log("Appointment updated after patient registration:", appt);

          return res.json({
            success: true,
            message: "Appointment updated and new patient created",
            data: appt,
          });
        } catch (patientCreationError) {
          console.error(
            "Error creating patient from temporary data:",
            patientCreationError
          );
          // If patient creation fails, do not update appointment status
          return res.status(500).json({
            success: false,
            message: "Failed to create new patient from temporary data",
            statusCode: 500,
          });
        }
      }

      // Update other fields if provided
      if (date) appt.date = new Date(date);
      if (time) appt.time = time;
      if (
        status &&
        ["scheduled", "completed", "cancelled", "registered"].includes(status)
      )
        appt.status = status;
      if (notes !== undefined) appt.notes = notes;

      await appt.save();

      res.json({ success: true, message: "Appointment updated", data: appt });
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        statusCode: 500,
      });
    }
  }
);

// Delete appointment
router.delete(
  "/:id",
  requireRole(["clinic_admin", "receptionist"]),
  async (req, res) => {
    try {
      const appointment = await Appointment.findOneAndDelete({
        _id: req.params.id,
        clinicId: req.user.clinicId,
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
          statusCode: 404,
        });
      }

      res.json({ success: true, message: "Appointment deleted successfully" });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        statusCode: 500,
      });
    }
  }
);

// GET /appointments/doctor/:doctorId/date/:date - get appointments for a doctor on a specific date
router.get(
  "/doctor/:doctorId/date/:date",
  requireRole(["clinic_admin", "receptionist"]),
  async (req, res) => {
    try {
      const { doctorId, date } = req.params;

      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const appointments = await Appointment.find({
        clinicId: req.user.clinicId,
        doctorId: doctorId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .populate("patientId", "name")
        .sort({ time: 1 });

      res.json({ success: true, data: appointments });
    } catch (error) {
      console.error("Error fetching appointments by doctor and date:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        statusCode: 500,
      });
    }
  }
);

module.exports = router;
