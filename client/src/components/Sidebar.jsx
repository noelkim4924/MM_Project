import React, { useState, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";
import { useNotificationStore } from "../store/useNotificationStore";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();
  const { notifications } = useNotificationStore();

  useEffect(() => {
    getMyMatches();
  }, [getMyMatches]);

  // notifications 변경 시 매칭 목록 갱신
  useEffect(() => {
    if (notifications.some((notif) => notif.status === "accepted")) {
      getMyMatches(); // 수락 시 매칭 목록 재조회
    }
  }, [notifications, getMyMatches]);

  // 백엔드 매칭과 알림 매칭 병합 (중복 제거)
  const allMatches = [
    ...matches,
    ...notifications
      .filter((notif) => notif.status === "accepted" && notif.mentorId)
      .map((notif) => ({
        _id: notif.mentorId,
        name: notif.mentorName,
        image: notif.mentorImage,
      }))
      .filter((mentor) => !matches.some((m) => m._id === mentor._id)),
  ];

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md overflow-hidden transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:w-1/4`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 pb-[27px] border-b border-blue-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-400">Matches</h2>
            <button
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleSidebar}
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 z-10 relative">
            {isLoadingMyMatches ? (
              <LoadingState />
            ) : allMatches.length === 0 ? (
              <NoMatchesFound />
            ) : (
              allMatches.map((match) => (
                <Link key={match._id} to={`/chat/${match._id}`}>
                  <div className="flex items-center mb-4 cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors duration-300">
                    <img
                      src={match.image || "/avatar.png"}
                      alt="User avatar"
                      className="size-12 object-cover rounded-full mr-3 border-2 border-blue-300"
                    />
                    <h3 className="font-semibold text-gray-800">{match.name || "Unknown User"}</h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <button
        className="lg:hidden fixed top-4 left-4 p-2 bg-blue-500 text-white rounded-md z-20"
        onClick={toggleSidebar}
      >
        <MessageCircle size={24} />
      </button>
    </>
  );
};

export default Sidebar;

const NoMatchesFound = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <HeartIcon className="text-blue-400 mb-4 h-12 w-12" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Matches Yet</h3>
    <p className="text-gray-500 max-w-xs">
      Don't worry! Your perfect match is just around the corner. Keep searching!
    </p>
  </div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <ClipLoader color="#93c5fd" size={48} />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Matches</h3>
    <p className="text-gray-500 max-w-xs">We're finding your perfect matches. This might take a moment...</p>
  </div>
);