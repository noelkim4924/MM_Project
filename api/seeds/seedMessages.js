import mongoose from 'mongoose';
import Message from '../models/Message.js';
import User from '../models/User.js'; // User 모델 가져오기
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../', '.env') });

const seedMessages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding messages');

    await Message.deleteMany({});

    // 기존 멘토 중 하나 선택 (예: James의 _id)
    const receiverUser = await User.findOne({ name: 'James' });
    if (!receiverUser) throw new Error('No receiver user found');
    const receiverId = receiverUser._id;
    const senderId = "67d2c49e371297ace224d4b2"; // 예시 sender ID (James)

    const dummyMessages = [
      {
        sender: senderId,
        receiver: receiverId,
        content: "Hello, this is a test message!",
        createdAt: new Date(),
      },
      {
        sender: receiverId,
        receiver: senderId,
        content: "Hi! Thanks for the message.",
        createdAt: new Date(),
      },
    ];

    await Message.insertMany(dummyMessages);
    console.log('Messages seeded successfully');
  } catch (error) {
    console.error('Error seeding messages:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seedMessages();