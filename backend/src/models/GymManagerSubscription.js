import mongoose from 'mongoose';

const gymManagerSubscriptionSchema = new mongoose.Schema({
  gymManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymManager',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
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
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'local'],
    required: true
  },
  paymentId: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
gymManagerSubscriptionSchema.index({ gymManager: 1, status: 1 });
gymManagerSubscriptionSchema.index({ endDate: 1 });

const GymManagerSubscription = mongoose.model('GymManagerSubscription', gymManagerSubscriptionSchema);

export default GymManagerSubscription;

