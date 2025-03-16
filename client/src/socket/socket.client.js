import io from "socket.io-client";

const SOCKET_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

let socket = null;

export const initializeSocket = (userId) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: { userId },
    reconnection: true, // 재연결 시도
    reconnectionAttempts: 5, // 재연결 시도 횟수
    reconnectionDelay: 1000, // 재연결 대기 시간
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};