import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Header } from "../components/Header";
import { axiosInstance } from "../lib/axios";
import UserDetailModal from "../components/UserDetailModal";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // ✅ 초기값을 null로 설정해서, 세부 카테고리 선택 전에는 멘토 목록이 안 뜨게 함
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const [mentors, setMentors] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState(["Home"]);

  // Fetch category data
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

  // Fetch mentors whenever a subcategory is selected
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
      } else {
        // If subcategory is null, clear mentors
        setMentors([]);
      }
    };
    fetchMentors();
  }, [selectedSubcategory]);

  // Handle breadcrumb clicks
  const handleBreadcrumbClick = (index) => {
    if (index === 0) {
      // "Home" clicked → reset everything
      setBreadcrumb(["Home"]);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setMentors([]);
    } else if (index === 1) {
      // e.g. ["Home", "Mentor: Data & AI"] → go back to that category
      setBreadcrumb(breadcrumb.slice(0, 2));
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setMentors([]);
    }
  };

  // Left side content (Category / Subcategory list)
  let leftContent;
  if (!selectedCategory) {
    // Show main category list
    leftContent = (
      <ul className="bg-white rounded-md border border-gray-200 divide-y divide-gray-200">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => {
              setSelectedCategory(cat);
              setBreadcrumb(["Home", cat.name]);
            }}
          >
            {cat.name}
          </li>
        ))}
      </ul>
    );
  } else {
    // Show subcategory list of the selected category
    leftContent = (
      <ul className="bg-white rounded-md border border-gray-200 divide-y divide-gray-200">
        {selectedCategory.subcategories.map((subcat) => (
          <li
            key={subcat._id}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
              selectedSubcategory && selectedSubcategory._id === subcat._id
                ? "bg-blue-50 font-bold"
                : ""
            }`}
            onClick={() => {
              setSelectedSubcategory(subcat);
              setBreadcrumb(["Home", selectedCategory.name, subcat.name]);
            }}
          >
            {subcat.name}
          </li>
        ))}
        <li
          className="p-4 cursor-pointer hover:bg-gray-50 text-blue-600"
          onClick={() => {
            setSelectedCategory(null);
            setBreadcrumb(["Home"]);
          }}
        >
          Go Back
        </li>
      </ul>
    );
  }

  // Right side content (Mentor list)
  let rightContent = null;
  if (selectedSubcategory) {
    rightContent = (
      <div>
        <h3 className="text-xl font-bold mb-4">
          Mentors for: {selectedSubcategory.name}
        </h3>
        <ul className="bg-white rounded-md border border-gray-200 divide-y divide-gray-200">
          {mentors.length > 0 ? (
            mentors.map((mentor) => (
              <li
                key={mentor._id}
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedUser(mentor)}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      mentor.image && mentor.image.trim() !== ""
                        ? mentor.image
                        : "/avatar.png"
                    }
                    alt="User avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{mentor.name}</p>
                    <p className="text-sm text-gray-500">Age: {mentor.age}</p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">
              No mentors found for this subcategory.
            </li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen h-screen bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
      <Sidebar />
      <div className="flex-grow flex flex-col">
        <Header />
        {/* Breadcrumb */}
        <nav className="p-4 text-sm text-gray-600">
          {breadcrumb.map((bc, idx) => (
            <span
              key={idx}
              className="cursor-pointer hover:underline"
              onClick={() => handleBreadcrumbClick(idx)}
            >
              {bc}
              {idx < breadcrumb.length - 1 && " / "}
            </span>
          ))}
        </nav>
        <div className="flex flex-1 overflow-y-auto">
          {/* Left: Category / Subcategory */}
          <div className="w-1/2 p-6">{leftContent}</div>
          {/* Right: Mentor list (only if subcategory is selected) */}
          <div className="w-1/2 p-6">{rightContent}</div>
        </div>
      </div>
      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default HomePage;
