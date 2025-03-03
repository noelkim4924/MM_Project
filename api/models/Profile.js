import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    default: '',
  },
  availability: {
    type: [String],
    default: [],
  },
  categories: {
    type: [String],
    default: [],
  },
});

const Profile = mongoose.model('Profile', ProfileSchema);
export default Profile;