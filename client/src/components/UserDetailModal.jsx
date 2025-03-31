import React from "react";
import { getSocket } from "../socket/socket.client";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  const { authUser } = useAuthStore();

  const handleRequestChat = () => {
    if (!authUser) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    const menteeId = authUser._id;
    try {
      const socket = getSocket();
      if (!socket.connected) {
        toast.error("소켓 연결이 끊어졌습니다. 새로고침 후 다시 시도해주세요.");
        return;
      }
      socket.emit("requestChat", { menteeId, mentorId: user._id });
      toast.success("채팅 요청을 보냈습니다!");
      onClose();
    } catch (err) {
      toast.error("소켓 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Socket error in handleRequestChat:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>
        <div className="flex flex-col items-center text-black">
          <img
            src={user.image && user.image.trim() !== "" ? user.image : "/avatar.png"}
            alt="User avatar"
            className="w-28 h-28 rounded-full border-2 border-gray-300 mb-4"
          />
          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          <p className="text-sm mb-1">Bio: {user.bio}</p>
          <p className="text-sm mb-1">Email: {user.email}</p>
          <p className="text-sm italic mb-4">
            {user.bio ? user.bio : "No bio provided."}
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleRequestChat}
          >
            Request Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;