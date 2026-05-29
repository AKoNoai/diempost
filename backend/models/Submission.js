const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 500
    },
    file: {
      url: {
        type: String,
        required: true
      },
      fileType: String,
      publicId: String
    },
    isAdminPost: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['approved'],
      default: 'approved'
    },
    notes: {
      type: String,
      default: ''
    },
    ipAddress: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
