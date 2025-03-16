import User from "../models/User.js";

export const swipeRight = async (req, res) => {
  try {
    const { likedUserId } = req.params;
    const currentUser = await User.findById(req.user._id);
    const likedUser = await User.findById(likedUserId);

    if (!likedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId);
      await currentUser.save();

      // if the other user has liked the current user, then it's a match
      if (likedUser.likes.includes(currentUser._id)) {
        currentUser.matches.push(likedUserId);
        likedUser.matches.push(currentUser._id);

        await Promise.all([
          currentUser.save(),
          likedUser.save(),
        ]);
      }
    }

    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    console.log("Error in swipeRight controller: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const swipeLeft = async (req, res) => {
  try {
    const { dislikedUserId } = req.params;
    const currentUser = await User.findById(req.user._id);

    if (!currentUser.dislikes.includes(dislikedUserId)) {
      currentUser.dislikes.push(dislikedUserId);
      await currentUser.save();
    }

    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    console.log("Error in swipeLeft controller: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("matches", "name image");

    res.status(200).json({
      success: true,
      message: "Matches fetched successfully",
      data: user.matches,
    });
  } catch (error) {
    console.log("Error in getMatches controller: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// matchController.js

export const getUserProfiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const { category, role } = req.query;

    // 기본 조건: 자기 자신 제외, 이미 매칭된 사용자 제외
    const conditions = [
      { _id: { $ne: currentUser._id } },
      { _id: { $nin: currentUser.matches } }
    ];

    // role이 제공되면 필터링 (mentor or mentee)
    if (role) {
      conditions.push({ role });
    }

    // ✅ category(서브카테고리 _id)가 제공되면,
    // "categories" 배열 중에 { categoryId: category, status: 'verified' }가 있어야 함
    if (category) {
      conditions.push({
        categories: {
          $elemMatch: {
            categoryId: category,
            status: "verified", // 🔑 verified 필터 추가
          },
        },
      });
    }

    // 최종 검색
    const users = await User.find({ $and: conditions });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("Error in getUserProfiles controller: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
