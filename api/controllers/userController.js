import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';
import Log from '../models/Log.js';
import Category from '../models/Category.js'

// userController.js (추가)

// userController.js

export const getAllUsers = async (req, res) => {
  console.log("getAllUsers called with query:", req.query);
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

    const { search, role, page = 1 } = req.query;
    // page가 문자열로 올 테니, 숫자로 변환
    const pageNumber = parseInt(page) || 1;
    const pageSize = 20; // 한 페이지에 20명

    let filter = {};

    // role이 mentor 또는 mentee 인 경우 필터
    if (role === 'mentor' || role === 'mentee') {
      filter.role = role;
    }

    // 이름/이메일 검색
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 총 유저 수(페이지네이션용)
    const totalCount = await User.countDocuments(filter);

    // 페이지네이션
    // 예: page=1이면 skip=0, page=2면 skip=20, ...
    const skip = (pageNumber - 1) * pageSize;

    // 유저 목록
    const users = await User.find(filter)
      .select('name email role') // 필요 필드만
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 }); // 정렬은 예시

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


// userController.js (추가)

export const adminUpdateUser = async (req, res) => {
  try {
    const { userId } = req.params; // URL parameter
    const { name, age, gender, role, bio, resetImage, categories } = req.body;
    // resetImage === true means the profile picture should be changed to avatar.png

    // 1) Find the user in the database
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
    // 관리자이므로 protectRoute나 isAdmin 체크만 통과하면 누구든 조회 가능
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

    // ✅ 카테고리는 자동으로 `pending` 상태로 저장
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

    // 1) 현재 DB에서 사용자 조회
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2) DB에 저장된 기존 categories
    const oldCategories = user.categories || [];
    // oldCategories: [{ categoryId, status }, ...]

    // 3) 프론트에서 넘어온 최종 categories
    //    예: [{ categoryId: "xxxx", status: "pending" }, ...]
    const incomingCategories = categories || [];

    // 4) 최종 반영할 배열을 만든다.
    //    (새로 추가된 항목은 pending, 기존 항목은 기존 status 유지)
    const finalCategories = incomingCategories.map((catObj) => {
      // 기존에 존재하던 항목인지 확인
      const oldCat = oldCategories.find(
        (o) => o.categoryId === catObj.categoryId
      );
      if (oldCat) {
        // 기존에 있던 카테고리는 원래 status를 유지
        return {
          categoryId: oldCat.categoryId,
          status: oldCat.status,
        };
      } else {
        // 새로 추가된 항목은 'pending'으로
        return {
          categoryId: catObj.categoryId,
          status: 'pending',
        };
      }
    });

    // 5) user.categories를 최종 배열로 교체
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

    // 7) DB 업데이트
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
    const { mentorId, categoryId, status, mentorName, categoryName } = req.body; // 어드민이 보낸 데이터

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
      action: `${categoryName} ${status} for ${mentorName}`,
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
    // 현재 로그인한 사용자 정보 가져오기
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // pending 상태의 카테고리가 하나라도 있는지 확인
    const hasPending = user.categories.some(cat => cat.status === 'pending');
    if (!hasPending) {
      return res.status(400).json({ message: 'There are no categories to verify.' });
    }

    // 여기서는 실제로 관리자에게 알림을 보내는 로직 대신, 
    // 단순히 "요청이 접수되었습니다" 메시지를 반환
    return res.status(200).json({ message: 'Verification request sent to admin.' });
  } catch (error) {
    console.error('Error in requestCategoryVerification:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// userController.js
export const getPendingMentors = async (req, res) => {
  try {
    // image 필드도 포함
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
        image: mentor.image,        // 추가
        categories: pendingCats,
      };
    });

    return res.status(200).json({ mentors: result });
  } catch (error) {
    console.error('Error in getPendingMentors:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};


