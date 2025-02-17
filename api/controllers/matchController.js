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

export const getUserProfiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    const users = await User.find({
      $and: [
        { _id: { $ne: currentUser._id } }, // not matching with self
        { _id: { $nin: currentUser.matches } }, // not matched with already matched users
      ],
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("Error in getUserProfiles controller: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
