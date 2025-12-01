import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const gymManagerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  gymName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'expired', 'suspended', 'cancelled'],
    default: 'expired'
  },
  currentSubscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymManagerSubscription'
  }
}, {
  timestamps: true
});

// Hash password before saving
gymManagerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
gymManagerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const GymManager = mongoose.model('GymManager', gymManagerSchema);

export default GymManager;

