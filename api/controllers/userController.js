import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createUserProfile = async (req, res) => {
  try {
    const { name, email, password, age, gender,role, bio, availability, categories } = req.body;
    if (!name || !email || !password || !age || !gender || !role) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      age,
      gender,
      role,
      bio: bio || '',
      availability: availability || [],
      categories: categories || [],
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { image, bio, availability, categories, ...otherData } = req.body;
    let updatedData = { bio, availability, categories, ...otherData };

    if (image && image.startsWith("data:image")) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        updatedData.image = uploadResponse.secure_url;
      } catch (uploadError) {
        console.log("Error in image upload: ", uploadError);
        return res.status(400).json({
          success: false,
          message: 'Image upload failed',
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updatedData,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.log("Error in updateProfile controller: ", error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};