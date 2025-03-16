import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useMatchStore } from "../store/useMatchStore";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import UserDetailModal from "../components/UserDetailModal";

const HomePage = () => {
  const { getUserProfiles } = useMatchStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState(["Home"]);

  // 기존과 동일한 그라디언트
  const gradientClasses = [
    "bg-gradient-to-r from-purple-400 to-indigo-500",
    "bg-gradient-to-r from-orange-400 to-yellow-500",
    "bg-gradient-to-r from-pink-400 to-red-500",
    "bg-gradient-to-r from-blue-400 to-cyan-500",
    "bg-gradient-to-r from-yellow-400 to-orange-500",
    "bg-gradient-to-r from-green-400 to-lime-500",
    "bg-gradient-to-r from-indigo-400 to-purple-500",
    "bg-gradient-to-r from-amber-400 to-yellow-500",
  ];

  // **아이콘 경로**: public/icons 폴더에 있다면, 실제 경로는 "/icons/..."
  const iconPaths = [
    "/icons/career-growth.png",
    "/icons/professional-dev.png",
    "/icons/diversity.png",
    "/icons/software-dev.png",
    "/icons/data-ai.png",
    "/icons/product-design.png",
    "/icons/career-leadership.png",
    "/icons/diversity-tech.png",
  ];

  // 1) 로그인/어드민 체크
  useEffect(() => {
    if (!authUser) {
      // 미로그인
      navigate("/auth");
    } else if (authUser.name === "admin") {
      // 어드민
      navigate("/admin");
    }
    // 멘토는 홈화면 그대로, 단 카테고리 카드 안 보이게 처리
  }, [authUser, navigate]);

  // 2) 카테고리 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 3) 유저 프로필 불러오기 (매칭 스토어)
  useEffect(() => {
    getUserProfiles();
  }, [getUserProfiles]);

  // 4) 특정 서브카테고리 선택 시 멘토 목록 불러오기
  useEffect(() => {
    const fetchMentors = async () => {
      if (selectedSubcategory) {
        try {
          const res = await axiosInstance.get("/matches/user-profiles", {
            params: {
              category: selectedSubcategory._id,
              role: "mentor",
            },
          });
          setMentors(res.data.users);
        } catch (err) {
          console.error("Error fetching mentors:", err);
        }
      }
    };
    if (selectedSubcategory) fetchMentors();
  }, [selectedSubcategory]);

  // 빵조각(브레드크럼) 처리
  const handleBreadcrumbClick = (index) => {
    if (index === 0) {
      setBreadcrumb(["Home"]);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setMentors([]);
    } else if (index === 1) {
      setBreadcrumb(breadcrumb.slice(0, 2));
      setSelectedSubcategory(null);
      setMentors([]);
    }
  };

  // =========================
  // 5) "카테고리 카드" 렌더링
  // =========================
  let content;

  // "멘티"인 경우 => 카테고리 카드 + 아이콘
  if (authUser?.role === "mentee") {
    if (!selectedCategory && !selectedSubcategory) {
      // 메인 카테고리 목록
      content = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {categories.map((cat, idx) => (
            <div
              key={cat._id}
              className={`p-4 cursor-pointer rounded-lg ${gradientClasses[idx % gradientClasses.length]} text-white h-48 w-full flex items-center justify-center`}
              onClick={() => {
                setSelectedCategory(cat);
                setBreadcrumb(["Home", cat.name]);
              }}
            >
              <div className="text-center flex flex-col items-center">
                <img
                  src={iconPaths[idx % iconPaths.length]}
                  alt={`${cat.name} icon`}
                  className="w-16 h-16 mb-2 opacity-75 rounded-full"
                  onError={(e) => console.error(`Image load failed: ${e.target.src}`)}
                />
                <p className="text-2xl font-semibold">{cat.name}</p>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (selectedCategory && !selectedSubcategory) {
      // 서브카테고리 목록
      content = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {selectedCategory.subcategories.map((subcat, idx) => (
            <div
              key={subcat._id}
              className={`p-4 cursor-pointer rounded-lg ${gradientClasses[idx % gradientClasses.length]} text-white h-48 w-full flex items-center justify-center`}
              onClick={() => {
                setSelectedSubcategory(subcat);
                setBreadcrumb(["Home", selectedCategory.name, subcat.name]);
              }}
            >
              <div className="text-center">
                <p className="text-2xl font-semibold">{subcat.name}</p>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (selectedSubcategory) {
      // 멘토 목록
      content = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {mentors.length > 0 ? (
            mentors.map((mentor, idx) => (
              <div
                key={mentor._id}
                className={`p-4 cursor-pointer rounded-lg ${gradientClasses[idx % gradientClasses.length]} text-white h-48 w-full flex items-center justify-center`}
                onClick={() => setSelectedUser(mentor)}
              >
                <img
                  src={
                    mentor.image && mentor.image.trim() !== ""
                      ? mentor.image
                      : "/avatar.png"
                  }
                  alt="User avatar"
                  className="w-20 h-20 rounded-full mb-2"
                />
                <div className="text-center">
                  <p className="font-semibold text-lg">{mentor.name}</p>
                  <p className="text-sm">Age: {mentor.age}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 p-4 text-center text-gray-500">
              해당 세부 카테고리에 멘토가 없습니다.
            </div>
          )}
        </div>
      );
    }
  } else {
    // 멘티가 아니면(멘토/어드민/로그아웃) => 카드 숨김, 다른 메시지
    content = (
      <div className="p-4 text-center text-gray-500">
        <p className="text-xl font-semibold mb-2">Always thanks to your service!</p>
        <p className="text-sm">
          To make better world
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen h-screen bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
      <Sidebar />
      <div className="flex-grow flex flex-col">
        <Header />
        <div className="flex-grow overflow-y-auto">
          <div className="container mx-auto p-4">
            {/* 빵조각 */}
            <nav className="mb-4 text-sm">
              {breadcrumb.map((bc, idx) => (
                <span key={idx} className="text-gray-600">
                  <span
                    className="cursor-pointer hover:underline text-blue-600"
                    onClick={() => handleBreadcrumbClick(idx)}
                  >
                    {bc}
                  </span>
                  {idx < breadcrumb.length - 1 && " / "}
                </span>
              ))}
            </nav>

            {/* 메인 컨텐츠 */}
            {content}
          </div>
        </div>

        {/* 유저 디테일 모달 */}
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
