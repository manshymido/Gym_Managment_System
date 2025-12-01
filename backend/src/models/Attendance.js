import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
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
  checkIn: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkOut: {
    type: Date
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
attendanceSchema.index({ gymManager: 1, member: 1, checkIn: -1 });
attendanceSchema.index({ checkIn: -1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;

