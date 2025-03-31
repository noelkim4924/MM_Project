import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const UserManagement = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("mentor");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearch("");
    setCurrentPage(1);
    fetchUsers(1, selectedRole, "");
  }, [selectedRole]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1, selectedRole, search);
  };

  const fetchUsers = async (page, role, searchValue) => {
    console.log("fetchUsers called with", page, role, searchValue);
    try {
      setLoading(true);
      const timestamp = new Date().getTime(); 

      const res = await axiosInstance.get(`/admin/users?t=${timestamp}`, {
        params: { role, search: searchValue, page },
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      console.log("API Response:", res);

      if (res.data.success) {
        setUsers(res.data.data || []);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchUsers(newPage, selectedRole, search);
  };

  const handleDetail = (userId) => {
    navigate(`/admin/edit-user/${userId}`);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {/* Role Selection */}
      <div className="flex space-x-2 mb-4">
        {["mentor", "mentee"].map((role) => (
          <button
            key={role}
            className={`px-4 py-2 rounded ${
              selectedRole === role ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => setSelectedRole(role)}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}s
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-gray-100">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id} className="border-b">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDetail(u._id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          className="px-3 py-1 bg-gray-300 rounded"
          disabled={currentPage <= 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          className="px-3 py-1 bg-gray-300 rounded"
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
