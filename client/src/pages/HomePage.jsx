import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useMatchStore } from "../store/useMatchStore";
import { Header } from "../components/Header";
import UserDetailModal from "../components/UserDetailModal";

const ITEMS_PER_PAGE = 9;

const HomePage = () => {
  const { isLoadingUserProfiles, getUserProfiles, userProfiles } = useMatchStore();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getUserProfiles();
  }, [getUserProfiles]);

  useEffect(() => {
    setFilteredUsers(userProfiles);
  }, [userProfiles]);

  const handleFilter = (criteria) => {
    if (criteria === "all") {
      setFilteredUsers(userProfiles);
    } else {
      setFilteredUsers(userProfiles.filter(user => user.category === criteria));
    }
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
      <Sidebar onFilter={handleFilter} />
      <div className="flex-grow flex flex-col overflow-hidden">
        <Header />
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoadingUserProfiles ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : selectedUsers.length === 0 ? (
            <p className="text-center text-gray-500">No users found.</p>
          ) : (
            selectedUsers.map((user) => (
              <div
                key={user._id}
                className="p-4 border rounded-lg shadow bg-white cursor-pointer hover:bg-blue-50 transition flex flex-col items-center"
                onClick={() => setSelectedUser(user)}
              >
                <img
                  src={user.image && user.image.trim() !== "" ? user.image : "/avatar.png"}
                  alt="User avatar"
                  className="w-20 h-20 rounded-full border-2 border-blue-300 mb-3"
                />
                <h3 className="text-lg font-bold text-center">{user.name}</h3>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              className={`px-3 py-1 border rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-4">{currentPage} / {totalPages}</span>
            <button
              className={`px-3 py-1 border rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {/* 유저 상세 모달 */}
        {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      </div>
    </div>
  );
};

export default HomePage;
