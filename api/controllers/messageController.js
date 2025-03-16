// api/controllers/messageController.js
import Message from "../models/Message.js";
import User from "../models/User.js";

// 메시지 전송 함수
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id; // protectRoute 미들웨어에서 설정된 사용자 ID

    // 새 메시지 생성 및 저장
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });
    await newMessage.save();

    res.status(200).json({ success: true, message: "Message sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 대화 기록 조회 함수
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params; // 대화 상대방 ID
    const currentUserId = req.user._id; // 현재 사용자 ID

    // 두 사용자 간의 메시지 기록 조회
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 }) // 시간순 정렬
      .populate("sender", "name") // 발신자 이름 포함
      .populate("receiver", "name"); // 수신자 이름 포함

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch conversation", error: err.message });
  }
};