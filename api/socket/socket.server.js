import { Server } from "socket.io";
import ChatRequest from "../models/ChatRequest.js";
import User from "../models/User.js";

let io;
const connectedUsers = new Map();

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) return next(new Error("Invalid user ID"));
    socket.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);
    connectedUsers.set(socket.userId, socket.id);

    // 멘티가 멘토에게 채팅 요청
    socket.on("requestChat", async ({ menteeId, mentorId }) => {
      try {
        const chatRequest = new ChatRequest({ menteeId, mentorId });
        await chatRequest.save();
        const mentee = await User.findById(menteeId).select("name");
        const mentorSocketId = connectedUsers.get(mentorId);
        if (mentorSocketId) {
          io.to(mentorSocketId).emit("chatRequest", {
            menteeId,
            requestId: chatRequest._id,
            menteeName: mentee.name || "Unknown User",
          });
          console.log(`Chat request sent to mentor ${mentorId}`);
        }
      } catch (err) {
        console.error("Error in requestChat:", err);
      }
    });

    socket.on("respondChat", async ({ requestId, status }) => {
      try {
        const chatRequest = await ChatRequest.findById(requestId).populate("menteeId mentorId");
        if (!chatRequest) throw new Error("Chat request not found");
    
        if (status === "accepted") {
          // 멘티와 멘토의 matches에 서로를 추가
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
        }
    
        // 기존 알림 전송 로직은 유지
      } catch (err) {
        console.error("Error processing respondChat:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      connectedUsers.delete(socket.userId);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

export const getConnectedUsers = () => connectedUsers;