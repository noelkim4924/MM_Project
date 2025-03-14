// import Message from "../models/Message.js";
// import { getConnectedUsers, getIO } from "../socket/socket.server.js";

// export const sendMessage = async (req, res) => {
// 	try {
// 		const { content, receiverId } = req.body;

// 		const newMessage = await Message.create({
// 			sender: req.user.id,
// 			receiver: receiverId,
// 			content,
// 		});

// 		const io = getIO();
// 		const connectedUsers = getConnectedUsers();
// 		const receiverSocketId = connectedUsers.get(receiverId);

// 		if (receiverSocketId) {
// 			io.to(receiverSocketId).emit("newMessage", {
// 				message: newMessage,
// 			});
// 		}

// 		res.status(201).json({
// 			success: true,
// 			message: newMessage,
// 		});
// 	} catch (error) {
// 		console.log("Error in sendMessage: ", error);
// 		res.status(500).json({
// 			success: false,
// 			message: "Internal server error",
// 		});
// 	}
// };

// export const getConversation = async (req, res) => {
// 	const { userId } = req.params;
// 	try {
// 		const messages = await Message.find({
// 			$or: [
// 				{ sender: req.user._id, receiver: userId },
// 				{ sender: userId, receiver: req.user._id },
// 			],
// 		}).sort("createdAt");

// 		res.status(200).json({
// 			success: true,
// 			messages,
// 		});
// 	} catch (error) {
// 		console.log("Error in getConversation: ", error);
// 		res.status(500).json({
// 			success: false,
// 			message: "Internal server error",
// 		});
// 	}
// };


import Message from "../models/Message.js";
import mongoose from "mongoose"; // mongoose 추가
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

export const sendMessage = async (req, res) => {
  try {
    const { content, receiverId } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ success: false, message: "Invalid receiver ID" });
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });

    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const receiverSocketId = connectedUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        message: newMessage,
      });
    }

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getConversation = async (req, res) => {
  const { userId } = req.params;
  try {
    console.log("Request user:", req.user); // 디버깅용
    console.log("Requested userId:", userId); // 디버깅용

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort("createdAt");

    res.status(200).json({
      success: true,
      messages: messages.length > 0 ? messages : [],
    });
  } catch (error) {
    console.log("Error in getConversation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};