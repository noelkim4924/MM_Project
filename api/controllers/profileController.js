import Profile from '../models/Profile.js';

// Get user profile by user ID
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching profile for user ID: ${userId}`); // Add logging
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      console.log('Profile not found'); // Add logging
      return res.status(404).json({ message: 'Profile not found' });
    }

    console.log('Profile found:', profile); // Add logging
    res.json(profile);
  } catch (error) {
    console.error('Server error:', error); // Add logging
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new user profile
export const createUserProfile = async (req, res) => {
  try {
    const { userId, bio, availability, categories } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const newProfile = await Profile.create({
      userId,
      bio: bio || '',
      availability: availability || [],
      categories: categories || [],
    });

    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bio, categories } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { bio, categories },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};