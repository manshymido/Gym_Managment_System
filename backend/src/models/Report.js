import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  gymManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymManager',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['revenue', 'members', 'attendance', 'subscriptions', 'custom'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  period: {
    start: Date,
    end: Date
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
reportSchema.index({ gymManager: 1, type: 1, generatedAt: -1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;

