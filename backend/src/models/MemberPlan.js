import mongoose from 'mongoose';

const memberPlanSchema = new mongoose.Schema({
  gymManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymManager',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  durationUnit: {
    type: String,
    enum: ['days', 'months', 'years'],
    default: 'months'
  },
  features: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
memberPlanSchema.index({ gymManager: 1, isActive: 1 });
memberPlanSchema.index({ gymManager: 1, name: 1 });

const MemberPlan = mongoose.model('MemberPlan', memberPlanSchema);

export default MemberPlan;

