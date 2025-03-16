// api/controllers/matchController.js
import User from "../models/User.js";
import ChatRequest from "../models/ChatRequest.js";
import { getIO, getConnectedUsers } from "../socket/socket.server.js";

export const acceptChatRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id; // 인증된 사용자 (멘토)

    const chatRequest = await ChatRequest.findById(requestId).populate("menteeId mentorId");
    if (!chatRequest || chatRequest.mentorId.toString() !== userId.toString()) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (chatRequest.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    // 상태 업데이트
    chatRequest.status = "accepted";
    await chatRequest.save();

    // 양쪽에 매칭 추가
    await Promise.all([
      User.updateOne(
        { _id: chatRequest.menteeId._id },
        { $addToSet: { matches: chatRequest.mentorId._id } }
      ),
      User.updateOne(
        { _id: chatRequest.mentorId._id },
        { $addToSet: { matches: chatRequest.menteeId._id } }
      ),
    ]);

    // 소켓 알림
    const io = getIO();
    const connectedUsersMap = getConnectedUsers();
    const menteeSocketId = connectedUsersMap.get(chatRequest.menteeId._id.toString());
    const mentorSocketId = connectedUsersMap.get(chatRequest.mentorId._id.toString());
    const mentor = await User.findById(chatRequest.mentorId._id).select("name image");

    if (menteeSocketId) {
      io.to(menteeSocketId).emit("chatResponse", {
        mentorId: chatRequest.mentorId._id,
        status: "accepted",
        mentorName: mentor.name,
        mentorImage: mentor.image,
      });
    }
    if (mentorSocketId) {
      io.to(mentorSocketId).emit("chatResponse", {
        menteeId: chatRequest.menteeId._id,
        status: "accepted",
        menteeName: chatRequest.menteeId.name,
      });
    }

    res.status(200).json({ success: true, message: "Chat request accepted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 기존 함수 유지
export const swipeRight = async (req, res) => {
  try {
    const { likedUserId } = req.params;
    const userId = req.user._id;
    const likedUser = await User.findById(likedUserId);
    if (!likedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, message: "Swipe right recorded" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const swipeLeft = async (req, res) => {
  try {
    const { likedUserId } = req.params;
    const userId = req.user._id;
    const likedUser = await User.findById(likedUserId);
    if (!likedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, message: "Swipe left recorded" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getMatches = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("matches", "name image");
    res.status(200).json({ matches: user.matches || [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch matches", error: err.message });
  }
};

// matchController.js

export const getUserProfiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const { category, role } = req.query;
    const userId = req.user._id;

    const users = await User.find({
      role: role || "mentor",
      categories: category,
      _id: { $ne: userId },
      matches: { $nin: [userId] },
    }).select("name image age");

    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user profiles", error: err.message });

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
