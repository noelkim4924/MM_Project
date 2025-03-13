import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const UnverifiedUsers = () => {
  const [selectedTab, setSelectedTab] = useState("mentees"); // 기본값: mentees

  return (
    <div className="p-6 bg-[#E6E1F2] rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Unverified User List</h2>
      
      {/* Mentors / Mentees Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-6 py-2 rounded-md font-semibold text-lg transition-colors duration-300 ${
            selectedTab === "mentors" ? "bg-[#B1A1D6] text-white" : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setSelectedTab("mentors")}
        >
          mentors
        </button>
        <button
          className={`px-6 py-2 rounded-md font-semibold text-lg transition-colors duration-300 ${
            selectedTab === "mentees" ? "bg-[#B1A1D6] text-white" : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setSelectedTab("mentees")}
        >
          mentees
        </button>
      </div>

      {/* User List */}
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-[#C3B7E7] p-4 rounded-lg shadow-md"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-lg">👤</span>
              </div>
              <span className="font-semibold text-lg text-gray-900">Example Mentee name</span>
            </div>

            <button className="px-4 py-1 bg-white text-gray-900 font-semibold rounded-md shadow-md">
              detail
            </button>

            <div className="flex space-x-2">
              <button className="text-red-500">
                <XCircle size={28} />
              </button>
              <button className="text-green-500">
                <CheckCircle size={28} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnverifiedUsers;
