import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

const UnverifiedUsers = () => {
  // pending 멘토 목록
  const [mentorList, setMentorList] = useState([]);
  // 로딩 상태
  const [loading, setLoading] = useState(false);
  // 서브카테고리 맵: { subcategoryId: subcategoryName }
  const [subcategoryMap, setSubcategoryMap] = useState({});

  // ─────────────────────────────────────────────────────────
  // 1) 컴포넌트 마운트 시 한 번에 데이터 불러오기
  //    - 모든 카테고리(서브카테고리) → subcategoryMap
  //    - pending 멘토 목록
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchAllCategories();
    fetchPendingMentors();
  }, []);

  // ─────────────────────────────────────────────────────────
  // (A) 모든 카테고리 불러와 subcategoryMap 생성
  // ─────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────
  // (B) Pending 멘토 목록 불러오기
  // ─────────────────────────────────────────────────────────
  const fetchPendingMentors = async () => {
    try {
      setLoading(true);
      // 백엔드: GET /users/pending-mentors
      const res = await axios.get("http://localhost:5001/api/users/pending-mentors", {
        withCredentials: true,
      });
      setMentorList(res.data.mentors || []);
    } catch (err) {
      console.error(err);
      // 에러처리 (toast 등) 가능
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // 2) 카테고리 승인 / 거절
  // ─────────────────────────────────────────────────────────
  const handleVerify = async (mentorId, categoryId) => {
    try {
      await axios.post("http://localhost:5001/api/users/verify-category", {
        mentorId,
        categoryId,
        status: "verified",
      }, { withCredentials: true });

      alert("Category has been verified.");
      fetchPendingMentors();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDecline = async (mentorId, categoryId) => {
    try {
      await axios.post("http://localhost:5001/api/users/verify-category", {
        mentorId,
        categoryId,
        status: "declined",
      }, { withCredentials: true });

      alert("Category has been declined.");
      fetchPendingMentors();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // ─────────────────────────────────────────────────────────
  // 3) UI 렌더링
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
          {mentorList.map((mentor) => (
            <div
              key={mentor._id}
              className="flex flex-col bg-purple-100 p-4 rounded-lg shadow-md"
            >
              {/* Mentor Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-lg">👤</span>
                  </div>
                  <span className="font-semibold text-lg text-gray-900">
                    {mentor.name} ({mentor.email})
                  </span>
                </div>
                <button className="px-4 py-1 bg-white text-gray-900 font-semibold rounded-md shadow-md">
                  detail
                </button>
              </div>

              {/* 멘토의 pending 카테고리들 */}
              <div className="mt-3 space-y-2">
                {mentor.categories.map((cat) => {
                  // subcategoryMap에서 카테고리 이름 찾기
                  const catName = subcategoryMap[cat.categoryId] || "Unknown Category";
                  return (
                    <div
                      key={cat.categoryId}
                      className="flex items-center justify-between bg-white p-2 rounded-md"
                    >
                      {/* ✅ 'Status: pending' 문구는 제거, 이름만 표시 */}
                      <span className="text-gray-800 font-medium">{catName}</span>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDecline(mentor._id, cat.categoryId)}
                          className="text-red-500 hover:text-red-700"
                          title="Decline"
                        >
                          <XCircle size={24} />
                        </button>
                        <button
                          onClick={() => handleVerify(mentor._id, cat.categoryId)}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnverifiedUsers;
