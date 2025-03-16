import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import Sidebar from "../components/Sidebar";
import { axiosInstance } from "../lib/axios";
import UserDetailModal from "../components/UserDetailModal";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState(["Home"]);

  // 그래디언트 색상 배열 (이미지 스타일에 맞게 조정)
  const gradientClasses = [
    "bg-gradient-to-r from-purple-400 to-indigo-500", // Mentee: Career Growth & Navigation
    "bg-gradient-to-r from-orange-400 to-yellow-500", // Mentee: Professional Development & Soft Skills
    "bg-gradient-to-r from-pink-400 to-red-500",     // Mentee: Diversity, Inclusion & Workplace Challenges
    "bg-gradient-to-r from-blue-400 to-cyan-500",    // Mentor: Software Development & Engineering
    "bg-gradient-to-r from-yellow-400 to-orange-500", // Mentor: Data & AI
    "bg-gradient-to-r from-green-400 to-lime-500",   // Mentor: Product & Design
    "bg-gradient-to-r from-indigo-400 to-purple-500", // Mentor: Career & Leadership
    "bg-gradient-to-r from-amber-400 to-yellow-500",  // Mentor: Diversity & Inclusion in Tech
  ];

  // 아이콘 경로 배열 (가정)
  const iconPaths = [
    "/public/icons/career-growth.png",         // Mentee: Career Growth & Navigation
    "/public/icons/professional-dev.png",      // Mentee: Professional Development & Soft Skills
    "/public/icons/diversity.png",             // Mentee: Diversity, Inclusion & Workplace Challenges
    "/public/icons/software-dev.png",          // Mentor: Software Development & Engineering
    "/public/icons/data-ai.png",               // Mentor: Data & AI
    "/public/icons/product-design.png",        // Mentor: Product & Design
    "/public/icons/career-leadership.png",     // Mentor: Career & Leadership
    "/public/icons/diversity-tech.png",        // Mentor: Diversity & Inclusion in Tech
  ];

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

  let content;
  if (!selectedCategory && !selectedSubcategory) {
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
                onError={(e) => console.error(`Image load failed: ${e.target.src}`)} // 디버깅용
              />
              <p className="text-2xl font-semibold">{cat.name}</p>
            </div>
          </div>
        ))}
      </div>
    );
  } else if (selectedCategory && !selectedSubcategory) {
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

  return (
    <div className="flex flex-col lg:flex-row min-h-screen h-screen bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
      <Sidebar />
      <div className="flex-grow flex flex-col">
        <Header />
        <div className="flex-grow overflow-y-auto">
          <div className="container mx-auto p-4">
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
            {content}
          </div>
        </div>
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