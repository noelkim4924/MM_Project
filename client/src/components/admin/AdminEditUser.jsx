import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminEditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/users/admin/users/${userId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        toast.error("Failed to load user detail");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching user detail");
    } finally {
      setLoading(false);
    }
  };

  // 예: "Reset Image" 버튼, "Update" 버튼 등 관리자 기능
  const handleResetImage = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/admin/users/${userId}`, {
        resetImage: true,
      }, { withCredentials: true });
      toast.success("Image reset to default");
      fetchUserDetail(); // 다시 불러오기
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset image");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Edit User</h2>
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={user.image || "/avatar.png"}
          alt="User Avatar"
          className="w-16 h-16 rounded-full border"
        />
        <button onClick={handleResetImage} className="px-3 py-1 bg-red-500 text-white rounded">
          Reset Image
        </button>
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Name</label>
        <div className="border p-2 rounded bg-gray-100">
          {user.name}
        </div>
      </div>
      {/* 나이, 성별, 역할 등 표시 or 수정 가능하게 */}
      {/* 필요 시 수정 로직 추가 (adminUpdateUser) */}
    </div>
  );
};

export default AdminEditUser;
