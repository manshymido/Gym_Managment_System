import mongoose from 'mongoose';

const memberSubscriptionSchema = new mongoose.Schema({
  gymManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymManager',
    required: true,
    index: true
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymMember',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MemberPlan',
    required: false
  },
  planName: {
    type: String,
    required: false,
    trim: true
  },
  price: {
    type: Number,
    required: false,
    min: 0
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'suspended'],
    default: 'active'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online', 'other'],
    default: 'cash'
  },
  autoRenew: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
memberSubscriptionSchema.index({ gymManager: 1, member: 1, status: 1 });
memberSubscriptionSchema.index({ endDate: 1 });

const MemberSubscription = mongoose.model('MemberSubscription', memberSubscriptionSchema);

export default MemberSubscription;

