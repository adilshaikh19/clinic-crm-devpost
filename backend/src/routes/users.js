const express = require('express');
const User = require('../models/User');
const Clinic = require('../models/Clinic');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const { hashPassword } = require('../utils/hash');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { ensureClinicIsolation } = require('../middleware/clinicIsolation');
const {
    userCreationValidation,
    handleValidationErrors
} = require('../utils/validation');

const router = express.Router();

// Apply authentication and clinic isolation to all routes
router.use(authenticateToken);
router.use(ensureClinicIsolation);

// Get all users in the clinic (admin only)
router.get('/', requireRole(['clinic_admin', 'doctor', 'receptionist']), async (req, res) => {
    try {
        const users = await User.find({
            clinicId: req.user.clinicId,
            role: { $ne: 'clinic_admin' } // Exclude admin users from the list
        }).select('-passwordHash');

        // Get clinic info
        const clinic = await Clinic.findOne({ clinicId: req.user.clinicId });

        res.json({
            success: true,
            data: users.map(user => ({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                specialization: user.specialization,
                licenseNumber: user.licenseNumber,
                qualifications: user.qualifications,
                experience: user.experience,
                createdAt: user.createdAt,
                isActive: user.isActive, // Include isActive status
                clinicName: clinic?.name
            }))
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
});

// Create new user (admin only)
router.post('/', requireRole(['clinic_admin', 'receptionist', 'doctor']), userCreationValidation, handleValidationErrors, async (req, res) => {
    try {
        const { name, email, password, role, phone, specialization, licenseNumber, qualifications, experience } = req.body;

        // Check if email already exists in this clinic
        const existingUser = await User.findOne({
            email: email,
            clinicId: req.user.clinicId
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists in this clinic',
                statusCode: 400
            });
        }

        // Validate role
        const allowedRoles = ['doctor', 'receptionist'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Allowed roles: doctor, receptionist',
                statusCode: 400
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const userData = {
            clinicId: req.user.clinicId,
            name,
            email: email,
            passwordHash: hashedPassword,
            role,
            phone: phone || null,
            isActive: true, // New users are active by default
        };

        // Add doctor-specific fields
        if (role === 'doctor') {
            if (specialization) userData.specialization = specialization;
            if (licenseNumber) userData.licenseNumber = licenseNumber;
            if (qualifications) userData.qualifications = qualifications;
            if (experience !== undefined) userData.experience = experience;
        }

        const newUser = new User(userData);
        await newUser.save();
        
        // Import ActivityLog model
        const ActivityLog = require('../models/ActivityLog');
        
        // Create activity log entry
        await ActivityLog.create({
            clinicId: req.user?.clinicId || newUser.clinicId,
            userId: req.user?.userId || newUser._id, // Use creator's ID or fallback to new user's ID
            action: 'create',
            entityType: 'user',
            entityId: newUser._id,
            description: `${req.user?.name || 'System'} created a new ${newUser.role}: ${newUser.name}`,
            details: { name: newUser.name, email: newUser.email, role: newUser.role }
        });

        // Return user data without password
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone,
            specialization: newUser.specialization,
            licenseNumber: newUser.licenseNumber,
            qualifications: newUser.qualifications,
            experience: newUser.experience,
            createdAt: newUser.createdAt,
            isActive: newUser.isActive
        };

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: userResponse
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
});

// Get user by ID
router.get(
  "/:id",
  requireRole(["clinic_admin", "receptionist", "doctor"]),
  async (req, res) => {
    try {
      const user = await User.findOne({
        _id: req.params.id,
        clinicId: req.user.clinicId,
      }).select("-passwordHash");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          statusCode: 404,
        });
      }

      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          specialization: user.specialization,
          createdAt: user.createdAt,
          isActive: user.isActive, // Include isActive status
        },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        statusCode: 500,
      });
    }
  }
);

// Update user (admin only)
router.put('/:id', requireRole(['clinic_admin']), async (req, res) => {
    try {
        const { name, email, role, phone, specialization, isActive } = req.body; // Added isActive

        const user = await User.findOne({
            _id: req.params.id,
            clinicId: req.user.clinicId
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                statusCode: 404
            });
        }

        // Check if email is being changed and if it already exists
        if (email && email !== user.email) {
            const existingUser = await User.findOne({
                email: email,
                clinicId: req.user.clinicId,
                _id: { $ne: req.params.id }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists in this clinic',
                    statusCode: 400
                });
            }
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (role && ['doctor', 'receptionist'].includes(role)) user.role = role;
        if (phone !== undefined) user.phone = phone;
        if (specialization !== undefined) user.specialization = specialization;
        if (typeof isActive === 'boolean') user.isActive = isActive; // Handle isActive

        await user.save();
        
        // Create activity log entry
        await ActivityLog.create({
            clinicId: req.user?.clinicId || user.clinicId,
            userId: req.user?.userId || user._id, // Use updater's ID or fallback to user's ID
            action: 'update',
            entityType: 'user',
            entityId: user._id,
            description: `${req.user?.name || 'System'} updated user: ${user.name}`,
            details: { name: user.name, email: user.email, role: user.role, isActive: user.isActive }
        });

        res.json({
            success: true,
            message: 'User updated successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                specialization: user.specialization,
                isActive: user.isActive // Include isActive in response
            }
        });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
});

// Update user status (activate/deactivate) (admin only)
router.put('/:id/status', requireRole(['clinic_admin']), async (req, res) => {
    // Import ActivityLog model
    const ActivityLog = require('../models/ActivityLog');
    try {
        const { isActive } = req.body; // Expect isActive in body

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Invalid status provided. isActive must be a boolean.',
                statusCode: 400
            });
        }

        const user = await User.findOne({
            _id: req.params.id,
            clinicId: req.user.clinicId
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                statusCode: 404
            });
        }

        // Prevent changing status of admin users
        if (user.role === 'clinic_admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot change status of admin users',
                statusCode: 403
            });
        }

        user.isActive = isActive; // Set isActive based on request body
        await user.save();
        
        // Create activity log entry
        await ActivityLog.create({
            clinicId: req.user?.clinicId || user.clinicId,
            userId: req.user?.userId || user._id, // Use updater's ID or fallback to user's ID
            action: 'update', // Using 'update' instead of 'activate'/'deactivate' to match allowed enum values
            entityType: 'user',
            entityId: user._id,
            description: `${req.user?.name || 'System'} ${isActive ? 'activated' : 'deactivated'} user: ${user.name}`,
            details: { name: user.name, email: user.email, role: user.role, isActive: user.isActive }
        });

        res.json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                specialization: user.specialization,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
});

// Delete user (admin only) - This route remains for permanent deletion
router.delete('/:id', requireRole(['clinic_admin']), async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
            clinicId: req.user.clinicId
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                statusCode: 404
            });
        }

        // Prevent deleting admin users
        if (user.role === 'clinic_admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users',
                statusCode: 403
            });
        }

        // Import ActivityLog model
        const ActivityLog = require('../models/ActivityLog');
        
        // Create activity log entry before deleting the user
        await ActivityLog.create({
            clinicId: req.user?.clinicId || user.clinicId,
            userId: req.user?.userId || user._id, // Use deleter's ID or fallback to user's ID
            action: 'delete',
            entityType: 'user',
            entityId: req.params.id,
            description: `${req.user?.name || 'System'} deleted user: ${user.name}`,
            details: { name: user.name, email: user.email, role: user.role }
        });
        
        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
});

// Update user profile (for current user)
router.put('/profile/:id', requireRole(['clinic_admin', 'doctor', 'receptionist']), async (req, res) => {
    try {
        const { name, email, phone, specialization } = req.body;

        // Users can only update their own profile unless they're admin
        if (req.user.role !== 'clinic_admin' && req.params.id !== req.user.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own profile',
                statusCode: 403
            });
        }

        const user = await User.findOne({
            _id: req.params.id,
            clinicId: req.user.clinicId
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                statusCode: 404
            });
        }

        // Check if email is being changed and if it already exists
        if (email && email !== user.email) {
            const existingUser = await User.findOne({
                email: email,
                clinicId: req.user.clinicId,
                _id: { $ne: req.params.id }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists in this clinic',
                    statusCode: 400
                });
            }
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (specialization !== undefined && user.role === 'doctor') user.specialization = specialization;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                specialization: user.specialization,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
});

// Update user password (for current user)
router.put('/password/:id', requireRole(['clinic_admin', 'doctor', 'receptionist']), async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Users can only update their own password unless they're admin
        if (req.user.role !== 'clinic_admin' && req.params.id !== req.user.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own password',
                statusCode: 403
            });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required',
                statusCode: 400
            });
        }

        const user = await User.findOne({
            _id: req.params.id,
            clinicId: req.user.clinicId
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                statusCode: 404
            });
        }

        // Verify current password
        const bcrypt = require('bcrypt');
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect',
                statusCode: 400
            });
        }

        // Hash new password
        const hashedNewPassword = await hashPassword(newPassword);
        user.passwordHash = hashedNewPassword;

        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
});

// Doctor dashboard stats
router.get(
  "/doctor/dashboard-stats",
  requireRole(["doctor"]),
  async (req, res) => {
    try {
      const doctorId = req.user.userId;
      const clinicId = req.user.clinicId;
      
      if (!doctorId || !clinicId) {
        return res.status(400).json({
          success: false,
          message: "Missing doctor ID or clinic ID",
          statusCode: 400,
        });
      }

      // Get current date ranges
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());
      const nextWeekStart = new Date(thisWeekStart);
      nextWeekStart.setDate(thisWeekStart.getDate() + 7);

      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);

      // Total assigned patients
      const totalPatients = await Patient.countDocuments({
        assignedDoctorId: doctorId,
        clinicId: clinicId,
      });

      // Today's appointments
      const todaysAppointments = await Appointment.countDocuments({
        doctorId: doctorId,
        clinicId: clinicId,
        date: { $gte: today, $lt: tomorrow },
      });

      // This week's appointments
      const thisWeekAppointments = await Appointment.countDocuments({
        doctorId: doctorId,
        clinicId: clinicId,
        date: { $gte: thisWeekStart, $lt: nextWeekStart },
      });

      // This month's appointments
      const thisMonthAppointments = await Appointment.countDocuments({
        doctorId: doctorId,
        clinicId: clinicId,
        date: { $gte: thisMonthStart, $lt: nextMonthStart },
      });

      // Total appointments
      const totalAppointments = await Appointment.countDocuments({
        doctorId: doctorId,
        clinicId: clinicId,
      });

      // Completed appointments
      const completedAppointments = await Appointment.countDocuments({
        doctorId: doctorId,
        clinicId: clinicId,
        status: 'completed',
      });

      // Cancelled appointments
      const cancelledAppointments = await Appointment.countDocuments({
        doctorId: doctorId,
        clinicId: clinicId,
        status: 'cancelled',
      });

      // Total prescriptions
      const totalPrescriptions = await Prescription.countDocuments({
        doctorId: doctorId,
        clinicId: clinicId,
      });

      // This month's prescriptions
      const thisMonthPrescriptions = await Prescription.countDocuments({
        doctorId: doctorId,
        clinicId: clinicId,
        createdAt: { $gte: thisMonthStart, $lt: nextMonthStart },
      });

      // Upcoming appointments (next 7 days)
      const upcomingAppointments = await Appointment.find({
        doctorId: doctorId,
        clinicId: clinicId,
        date: { $gte: today, $lt: nextWeekStart },
        status: { $in: ['scheduled', 'registered'] },
      })
        .populate('patientId', 'name phone')
        .sort({ date: 1, time: 1 })
        .limit(5);

      // Recent patients (last 10 patients seen)
      const recentPatients = await Appointment.find({
        doctorId: doctorId,
        clinicId: clinicId,
        status: 'completed',
      })
        .populate('patientId', 'name phone dateOfBirth')
        .sort({ date: -1 })
        .limit(10);

      // Appointment status distribution
      const appointmentStatusStats = await Appointment.aggregate([
        {
          $match: {
            doctorId: doctorId,
            clinicId: clinicId,
          },
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      // Monthly appointment trends (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyTrends = await Appointment.aggregate([
        {
          $match: {
            doctorId: doctorId,
            clinicId: clinicId,
            date: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
      ]);

      res.json({
        success: true,
        data: {
          // Overview stats
          totalPatients,
          todaysAppointments,
          thisWeekAppointments,
          thisMonthAppointments,
          totalAppointments,
          completedAppointments,
          cancelledAppointments,
          totalPrescriptions,
          thisMonthPrescriptions,
          
          // Detailed data
          upcomingAppointments,
          recentPatients,
          appointmentStatusStats,
          monthlyTrends,
          
          // Calculated metrics
          completionRate: totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0,
          cancellationRate: totalAppointments > 0 ? Math.round((cancelledAppointments / totalAppointments) * 100) : 0,
        },
      });
    } catch (error) {
      console.error("Error fetching doctor dashboard stats:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        statusCode: 500,
      });
    }
  }
);

module.exports = router;