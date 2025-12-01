import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  gymManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymManager',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['gym_manager_subscription', 'member_subscription'],
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'EGP'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'cash', 'card', 'online', 'local', 'other'],
    required: true
  },
  paymentGatewayId: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paidAt: {
    type: Date
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
paymentSchema.index({ gymManager: 1, status: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;

