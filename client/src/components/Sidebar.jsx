import { useState, useEffect } from "react"; 
import { X, MessageCircle } from "lucide-react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();
  const { authUser } = useAuthStore(); // 로그인한 유저 정보 가져오기

  useEffect(() => {
    getMyMatches();
  }, [getMyMatches]);

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
            <h2 className="text-xl font-bold text-blue-400">
              {authUser?.name === "admin" ? "Admin Panel" : "Matches"}
            </h2>
            <button
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleSidebar}
            >
              <X size={24} />
            </button>
          </div>

          {/* ✅ 어드민이면 Admin Panel UI */}
          {authUser?.name === "admin" ? (
            <div className="flex-grow overflow-y-auto p-4">
              <ul className="space-y-4">
                <li 
                  className={`cursor-pointer p-2 rounded-md ${selectedTab === "unverified" ? "bg-blue-200 text-black" : ""}`} 
                  onClick={() => setSelectedTab("unverified")}
                >
                  Unverified Users
                </li>
                <li 
                  className={`cursor-pointer p-2 rounded-md ${selectedTab === "management" ? "bg-blue-200 text-black" : ""}`} 
                  onClick={() => setSelectedTab("management")}
                >
                  User Management
                </li>
                <li 
                  className={`cursor-pointer p-2 rounded-md ${selectedTab === "reports" ? "bg-blue-200 text-black" : ""}`} 
                  onClick={() => setSelectedTab("reports")}
                >
                  Reports
                </li>
                <li 
                  className={`cursor-pointer p-2 rounded-md ${selectedTab === "history" ? "bg-blue-200 text-black" : ""}`} 
                  onClick={() => setSelectedTab("history")}
                >
                  User History
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-4 z-10 relative">
              {isLoadingMyMatches ? (
                <LoadingState />
              ) : matches.length === 0 ? (
                <NoMatchesFound /> // ✅ 기존 UI 복구
              ) : (
                matches.map((match) => (
                  <Link key={match._id} to={`/chat/${match._id}`}>
                    <div
                      className="flex items-center mb-4 cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors duration-300"
                    >
                      <img
                        src={match.image || "/avatar.png"}
                        alt="User avatar"
                        className="size-12 object-cover rounded-full mr-3 border-2 border-blue-300"
                      />
                      <h3 className="font-semibold text-gray-800">{match.name}</h3>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
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
