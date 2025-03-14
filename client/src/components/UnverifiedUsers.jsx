import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

const UnverifiedUsers = () => {
  // 기본값: mentees
  const [selectedTab, setSelectedTab] = useState("mentees");
  // pending 멘토 목록
  const [mentorList, setMentorList] = useState([]);
  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // ✅ (1) 서브카테고리 맵: { subcategoryId: subcategoryName }
  const [subcategoryMap, setSubcategoryMap] = useState({});

  // ✅ (2) 컴포넌트가 마운트되면, 모든 카테고리(서브카테고리)를 불러와서 subcategoryMap 생성
  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      // CategoryDropdown.jsx에서 쓰는 경로와 동일 ("/api/categories")
      // 백엔드가 이 경로에서 { success: true, data: [ { _id, name, subcategories: [...] }, ... ] } 형태로 응답
      const res = await axios.get("http://localhost:5001/api/categories", {
        withCredentials: true,
      });
      const catData = res.data.data || [];

      // 새로운 맵 객체: subcategoryId -> subcategoryName
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

  // 탭이 mentors일 때만, pending 멘토 목록을 불러옴
  useEffect(() => {
    if (selectedTab === "mentors") {
      fetchPendingMentors();
    }
    // mentees 탭은 별도 로직이 필요하다면 구현
  }, [selectedTab]);

  const fetchPendingMentors = async () => {
    try {
      setLoading(true);
      // 백엔드: GET /users/pending-mentors
      const res = await axios.get("http://localhost:5001/api/users/pending-mentors", {
        withCredentials: true,
      });
      console.log("pending mentors response:", res.data);
      setMentorList(res.data.mentors || []);
    } catch (err) {
      console.error(err);
      // 에러처리 (toast 등) 가능
    } finally {
      setLoading(false);
    }
  };

  // 승인
  const handleVerify = async (mentorId, categoryId) => {
    try {
      await axios.post("http://localhost:5001/api/users/verify-category", {
        mentorId,
        categoryId,
        status: "verified",
      }, { withCredentials: true });

      alert("Category verified successfully.");
      // 다시 목록 새로고침
      fetchPendingMentors();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // 거절
  const handleDecline = async (mentorId, categoryId) => {
    try {
      await axios.post("http://localhost:5001/api/users/verify-category", {
        mentorId,
        categoryId,
        status: "declined",
      }, { withCredentials: true });

      alert("Category declined.");
      fetchPendingMentors();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 bg-[#E6E1F2] rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Unverified User List
      </h2>
      
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

      {selectedTab === "mentors" && (
        <div className="space-y-4">
          {loading && <div>Loading mentors...</div>}
          {!loading && mentorList.length === 0 && (
            <div>No mentors with pending categories.</div>
          )}

          {mentorList.map((mentor) => (
            <div
              key={mentor._id}
              className="flex flex-col bg-[#C3B7E7] p-4 rounded-lg shadow-md mb-4"
            >
              {/* Mentor info */}
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

              {/* mentor.categories: pending인 것들 */}
              <div className="mt-2 space-y-2">
                {mentor.categories.map((cat) => {
                  // ✅ subcategoryMap에서 이름 찾기
                  // cat.categoryId -> 실제 subcategory의 이름
                  const catName = subcategoryMap[cat.categoryId] || "Unknown Category";
                  return (
                    <div
                      key={cat.categoryId}
                      className="flex items-center justify-between bg-white p-2 rounded-md"
                    >
                      <span className="text-gray-800">
                        {catName} - Status: {cat.status}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDecline(mentor._id, cat.categoryId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XCircle size={24} />
                        </button>
                        <button
                          onClick={() => handleVerify(mentor._id, cat.categoryId)}
                          className="text-green-500 hover:text-green-700"
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
      )}
    </div>
  );
};

export default UnverifiedUsers;
