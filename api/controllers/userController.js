import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';
import Log from '../models/Log.js';
import Category from '../models/Category.js'



export const getAllUsers = async (req, res) => {
  console.log("getAllUsers called with query:", req.query);
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

    const { search, role, page = 1 } = req.query;
 
    const pageNumber = parseInt(page) || 1;
    const pageSize = 20; 

    let filter = {};

    
    if (role === 'mentor' || role === 'mentee') {
      filter.role = role;
    }

   
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

   
    const totalCount = await User.countDocuments(filter);

   
    const skip = (pageNumber - 1) * pageSize;


    const users = await User.find(filter)
      .select('name email role')
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const currentPage = pageNumber;
    const totalPages = Math.ceil(totalCount / pageSize);

    return res.status(200).json({
      success: true,
      data: users,
      totalCount,
      currentPage,
      totalPages,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




export const adminUpdateUser = async (req, res) => {
  try {
    const { userId } = req.params; // URL parameter
    const { name, age, gender, role, bio, resetImage, categories } = req.body;
   

 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2) Update only the fields that can be modified
    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (role !== undefined) user.role = role;
    if (bio !== undefined) user.bio = bio;

    // “Inappropriate profile picture” → resetImage = true means change to avatar.png
    if (resetImage) {
      user.image = "/avatar.png"; // or the actual CDN path
    }

    // Handle categories similar to updateProfile function
    const oldCategories = user.categories || [];
    const incomingCategories = categories || [];

    const finalCategories = incomingCategories.map((catObj) => {
      const oldCat = oldCategories.find(
        (o) => o.categoryId.toString() === catObj.categoryId.toString()
      );
      if (oldCat) {
        return {
          categoryId: oldCat.categoryId,
          status: oldCat.status,
        };
      } else {
        return {
          categoryId: catObj.categoryId,
          status: 'pending',
        };
      }
    });

    user.categories = finalCategories;

    await user.save();

    return res.json({
      success: true,
      message: "User updated by admin successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in adminUpdateUser:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const adminGetUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
 
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error in adminGetUserProfile:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


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
    const { name, email, password, age, gender, role, bio, availability, categories } = req.body;
    if (!name || !email || !password || !age || !gender || !role) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    const formattedCategories = categories.map((catId) => ({
      categoryId: catId,
      status: 'pending',
    }));

    const newUser = await User.create({
      name,
      email,
      password,
      age,
      gender,
      role,
      bio: bio || '',
      availability: availability || [],
      categories: formattedCategories,
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
    let updatedData = { bio, availability, ...otherData };

   
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

 
    const oldCategories = user.categories || [];
   


    const incomingCategories = categories || [];

    const removedCatIds = oldCategories
      .filter((oldCat) => {
        // incoming에 같은 categoryId가 전혀 없으면 => 삭제됨
        return !incomingCategories.some(
          (catObj) => catObj.categoryId === oldCat.categoryId
        );
      })
      .map((cat) => cat.categoryId);

   
    const finalCategories = incomingCategories.map((catObj) => {
      // oldCat 찾기
      const oldCat = oldCategories.find(
        (o) => o.categoryId === catObj.categoryId
      );

      if (oldCat) {
 
        if (removedCatIds.includes(oldCat.categoryId)) {
          return {
            categoryId: catObj.categoryId,
            status: 'pending',
          };
        } else {

          return {
            categoryId: oldCat.categoryId,
            status: oldCat.status,
          };
        }
      } else {
  
        return {
          categoryId: catObj.categoryId,
          status: 'pending',
        };
      }
    });

  
    updatedData.categories = finalCategories;

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

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.log("Error in updateProfile controller: ", error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const verifyMentorCategory = async (req, res) => {
  try {
    const { mentorId, categoryId, status, mentorName, categoryName } = req.body; 

    if (!['verified', 'declined'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'verified' or 'declined'." });
    }

    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const categoryIndex = mentor.categories.findIndex(cat => cat.categoryId.toString() === categoryId);
    if (categoryIndex === -1) {
      return res.status(404).json({ message: 'Category not found in mentor profile' });
    }

    // Log the user creation
    await Log.create({
      user: mentorId,
      action: `${status.toUpperCase()} – ${categoryName}`,
      status: status,
      timestamp: Date.now()
    });

    mentor.categories[categoryIndex].status = status;
    await mentor.save();

    res.status(200).json({ success: true, message: `Category ${status} successfully.` });
  } catch (error) {
    console.error('Error in verifyMentorCategory:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


export const requestCategoryVerification = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hasPending = user.categories.some(cat => cat.status === 'pending');
    if (!hasPending) {
      return res.status(400).json({ message: 'There are no categories to verify.' });
    }


    return res.status(200).json({ message: 'Verification request sent to admin.' });
  } catch (error) {
    console.error('Error in requestCategoryVerification:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// userController.js
export const getPendingMentors = async (req, res) => {
  try {

    const mentors = await User.find({
      role: 'mentor',
      'categories.status': 'pending'
    }).select('name email image categories');

    console.log("getPendingMentors() -> mentors:", mentors);

    const result = mentors.map(mentor => {
      const pendingCats = mentor.categories.filter(cat => cat.status === 'pending');
      return {
        _id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        image: mentor.image,        
        categories: pendingCats,
      };
    });

    return res.status(200).json({ mentors: result });
  } catch (error) {
    console.error('Error in getPendingMentors:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};


