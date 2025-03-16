import React from "react";

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gradient-to-r from-purple-400 to-blue-500 p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300 text-lg"
        >
          ✕
        </button>
        <div className="flex flex-col items-center text-white">
          <img
            src={user.image && user.image.trim() !== "" ? user.image : "/avatar.png"}
            alt="User avatar"
            className="w-28 h-28 rounded-full border-2 border-blue-300 mb-3"
          />
          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          <p className="text-sm mb-1">Age: {user.age}</p>
          <p className="text-sm mb-1">Email: {user.email}</p>
          <p className="text-sm italic mb-4">
            {user.bio ? user.bio : "No bio provided."}
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => (window.location.href = `/chat/${user._id}`)}
          >
            Request Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;