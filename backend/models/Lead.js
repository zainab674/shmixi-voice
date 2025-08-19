import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    source: {
        type: String,
        required: true
    },
    user_agent: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
        default: 'new'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for better query performance
leadSchema.index({ email: 1, timestamp: -1 });
leadSchema.index({ status: 1, timestamp: -1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
