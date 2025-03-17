import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['accepted', 'rejected'],
    default: null
  }
});

const Log = mongoose.model('Log', logSchema);

export default Log;