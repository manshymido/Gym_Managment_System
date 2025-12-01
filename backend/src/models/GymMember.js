import mongoose from 'mongoose';

const gymMemberSchema = new mongoose.Schema({
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
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    type: String,
    trim: true
  },
  emergencyContact: {
    name: String,
    phone: String
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
gymMemberSchema.index({ gymManager: 1, isActive: 1 });

const GymMember = mongoose.model('GymMember', gymMemberSchema);

export default GymMember;

