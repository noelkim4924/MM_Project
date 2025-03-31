import { useState, useEffect } from "react";
import { axiosInstance } from '../lib/axios'; // Correct path as specified
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
      const res = await axiosInstance.get("/categories");
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
      const res = await axiosInstance.get("/users/pending-mentors");
      setMentorList(res.data.mentors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (mentorId, mentorName, categoryId, categoryName) => {
    setConfirmState({
      open: true,
      type: "verify",
      message: "Are you sure you want to verify this category?",
      onConfirm: async () => {
        try {
          await axiosInstance.post("/users/verify-category", {
            mentorId,
            categoryId,
            status: "verified",
            mentorName,
            categoryName,
          });
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
          await axiosInstance.post("/users/verify-category", {
            mentorId,
            categoryId,
            status: "declined",
            mentorName,
            categoryName,
          });
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

        <div className="space-y-4">
          {mentorList.map((mentor) => {
            const profileImage = mentor.image || defaultImage;
            return (
              <div
                key={mentor._id}
                className="flex flex-col bg-purple-100 p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={profileImage}
                    alt="User Avatar"
                    className="w-14 h-14 object-cover rounded-full border-4 border-white drop-shadow-[0px_4px_6px_rgba(0,0,0,0.3)]"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg text-gray-900">
                      {mentor.name}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-600 text-sm mt-1">
                      <Mail size={16} />
                      <span>{mentor.email}</span>
                    </div>
                  </div>
                </div>

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

      {confirmState.open && (
        <ConfirmToast
          type={confirmState.type}
          message={confirmState.message}
          onConfirm={confirmYes}
          onCancel={closeConfirm}
        />
      )}
    </div>
  );
};

export default UnverifiedUsers;