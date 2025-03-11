import React from "react";

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <div className="flex flex-col items-center">
          <img
            src={user.image && user.image.trim() !== "" ? user.image : "/avatar.png"}
            alt="User avatar"
            className="w-24 h-24 rounded-full border-2 border-blue-300 mb-3"
          />
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-gray-400">Age: {user.age || "Not specified"}</p>
          <p className="text-gray-400">Gender: {user.gender || "Not specified"}</p>
          <div className="mt-4 text-center">
            <p className="text-gray-700">{user.description || "No additional details provided."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
