import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import ConfirmToast from "./ConfirmToast";
import { toast } from "react-hot-toast";

const UnverifiedUsers = () => {
  const [mentorList, setMentorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subcategoryMap, setSubcategoryMap] = useState({});
  const defaultImage = "/avatar.png";

  const [confirmState, setConfirmState] = useState({
    open: false,
    type: "verify",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    fetchAllCategories();
    fetchPendingMentors();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/categories", {
        withCredentials: true,
      });
      const catData = res.data.data || [];

      const newMap = {};
      catData.forEach((catObj) => {
        catObj.subcategories.forEach((sub) => {
          newMap[sub._id] = sub.name;
        });
      });

      setSubcategoryMap(newMap);
    } catch (err) {
      console.error("Error fetching categories for admin map:", err);
    }
  };

  const fetchPendingMentors = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5001/api/users/pending-mentors", {
        withCredentials: true,
      });
      setMentorList(res.data.mentors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // 2) "Verify" / "Decline" 버튼 클릭 시 → confirmState 열기
  // ─────────────────────────────────────────────────────────
  const handleVerify = (mentorId, mentorName, categoryId, categoryName) => {
    setConfirmState({
      open: true,
      type: "verify",
      message: "Are you sure you want to verify this category?",
      onConfirm: async () => {
        try {
          await axios.post("http://localhost:5001/api/users/verify-category", {
            mentorId,
            categoryId,
            status: "verified",
            mentorName,
            categoryName
          }, { withCredentials: true });

          toast.success("Category has been verified.");
          fetchPendingMentors();
        } catch (err) {
          console.error(err);
          alert(err.response?.data?.message || "Something went wrong");
        }
      },
    });
  };

  const handleDecline = (mentorId, mentorName, categoryId, categoryName) => {
    setConfirmState({
      open: true,
      type: "decline",
      message: "Are you sure you want to decline this category?",
      onConfirm: async () => {
        try {
          await axios.post("http://localhost:5001/api/users/verify-category", {
            mentorId,
            categoryId,
            status: "declined",
            mentorName,
            categoryName
          }, { withCredentials: true });

          toast.success("Category has been declined.");
          fetchPendingMentors();
        } catch (err) {
          console.error(err);
          alert(err.response?.data?.message || "Something went wrong");
        }
      },
    });
  };

  const closeConfirm = () => {
    setConfirmState({ ...confirmState, open: false });
  };

  const confirmYes = async () => {
    if (confirmState.onConfirm) {
      await confirmState.onConfirm();
    }
    setConfirmState({ ...confirmState, open: false });
  };

  // ─────────────────────────────────────────────────────────
  // 3) UI
  // ─────────────────────────────────────────────────────────
  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Pending Mentor Category Verification
        </h2>

        {loading && (
          <div className="text-center text-gray-700 mb-4">Loading mentors...</div>
        )}

        {!loading && mentorList.length === 0 && (
          <div className="text-center text-gray-600">No pending mentor categories found.</div>
        )}

        {/* 멘토 리스트 */}
        <div className="space-y-4">
          {mentorList.map((mentor) => {
            const profileImage = mentor.image || defaultImage;
            return (
              <div
                key={mentor._id}
                className="flex flex-col bg-purple-100 p-4 rounded-lg shadow-md"
              >
                {/* Mentor Info */}
                <div className="flex items-center space-x-4">
                  {/* 프로필 이미지 */}
                  <img
                    src={profileImage}
                    alt="User Avatar"
                    className="w-14 h-14 object-cover rounded-full border-4 border-white drop-shadow-[0px_4px_6px_rgba(0,0,0,0.3)]"
                  />

                  {/* 이름 + 이메일 */}
                  <div className="flex flex-col">
                    {/* 이름 */}
                    <span className="font-semibold text-lg text-gray-900">
                      {mentor.name}
                    </span>
                    {/* 이메일 */}
                    <div className="flex items-center space-x-1 text-gray-600 text-sm mt-1">
                      <Mail size={16} />
                      <span>{mentor.email}</span>
                    </div>
                  </div>
                </div>

                {/* 멘토의 pending 카테고리들 */}
                <div className="mt-3 space-y-2">
                  {mentor.categories.map((cat) => {
                    const catName = subcategoryMap[cat.categoryId] || "Unknown Category";
                    return (
                      <div
                        key={cat.categoryId}
                        className="flex items-center justify-between bg-white p-2 rounded-md"
                      >
                        <span className="text-gray-800 font-medium">{catName}</span>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDecline(mentor._id, mentor.name, cat.categoryId, catName)}
                            className="text-red-500 hover:text-red-700"
                            title="Decline"
                          >
                            <XCircle size={24} />
                          </button>
                          <button
                            onClick={() => handleVerify(mentor._id, mentor.name, cat.categoryId, catName)}
                            className="text-green-500 hover:text-green-700"
                            title="Verify"
                          >
                            <CheckCircle size={24} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ConfirmToast */}
      {confirmState.open && (
        <ConfirmToast
          type={confirmState.type}       // verify or decline
          message={confirmState.message}
          onConfirm={confirmYes}
          onCancel={closeConfirm}
        />
      )}
    </div>
  );
};

export default UnverifiedUsers;
