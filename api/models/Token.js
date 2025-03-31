// filepath: c:\Users\davin\PracticumProj\MM_Project\api\models\Token.js
import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
});

tokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model('Token', tokenSchema);

export default Token;