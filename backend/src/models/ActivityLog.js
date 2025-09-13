const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    clinicId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['create', 'update', 'delete', 'login', 'logout']
    },
    entityType: {
        type: String,
        required: true,
        enum: ['user', 'patient', 'appointment', 'prescription', 'clinic']
    },
    entityId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true
});

// Compound index for efficient querying by clinic and date
activityLogSchema.index({ clinicId: 1, createdAt: -1 });

// Index for querying by user
activityLogSchema.index({ clinicId: 1, userId: 1, createdAt: -1 });

// Index for querying by entity
activityLogSchema.index({ clinicId: 1, entityType: 1, entityId: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;