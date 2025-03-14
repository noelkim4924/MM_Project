import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Header } from "../components/Header";
import MainSection from "../components/MainSection";
import { axiosInstance } from "../lib/axios";
import UserDetailModal from "../components/UserDetailModal";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMentors = async () => {
      if (selectedSubcategory && selectedSubcategory !== "all") {
        try {
          const response = await axiosInstance.get("/matches/user-profiles", {
            params: {
              category: selectedSubcategory._id,
              role: "mentor",
            },
          });
          setMentors(response.data.users);
        } catch (error) {
          console.error("Failed to fetch mentors:", error);
        }
      }
    };
    fetchMentors();
  }, [selectedSubcategory]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen h-screen bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
      <Sidebar />
      <div className="flex-grow flex flex-col overflow-hidden">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          {!selectedCategory ? (
            <MainSection
              categories={categories}
              onCategorySelect={(cat) => {
                setSelectedCategory(cat);
                setSelectedSubcategory(null);
              }}
              onSubcategorySelect={() => {}}
            />
          ) : selectedCategory && !selectedSubcategory ? (
            <div className="p-4 grid grid-cols-3 gap-4 w-full h-full">
              {selectedCategory.subcategories && selectedCategory.subcategories.map((subcat) => (
                <div
                  key={subcat._id}
                  className="p-4 border rounded-lg shadow bg-white cursor-pointer hover:bg-blue-50 transition flex items-center justify-center text-center w-full h-full"
                  onClick={() => setSelectedSubcategory(subcat)}
                >
                  <h3 className="text-lg font-bold">{subcat.name}</h3>
                </div>
              ))}
              <div
                className="p-4 border rounded-lg shadow bg-gray-200 cursor-pointer hover:bg-gray-300 transition flex items-center justify-center text-center"
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                }}
              >
                <h3 className="text-lg font-bold">Back</h3>
              </div>
            </div>
          ) : selectedSubcategory && (
            <div className="p-4 grid grid-cols-3 gap-4 w-full h-full">
              {mentors && mentors.length > 0 ? (
                mentors.map((mentor) => (
                  <div
                    key={mentor._id}
                    className="p-4 border rounded-lg shadow bg-white cursor-pointer hover:bg-blue-50 transition flex flex-col items-center justify-center text-center"
                    onClick={() => setSelectedUser(mentor)}
                  >
                    <img
                      src={mentor.image && mentor.image.trim() !== "" ? mentor.image : "/avatar.png"}
                      alt="User avatar"
                      className="w-16 h-16 rounded-full mb-2"
                    />
                    <h3 className="text-lg font-bold">{mentor.name}</h3>
                    <p className="text-gray-500">Age: {mentor.age}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-3">
                  No Mentor in category
                </p>
              )}
              <div
                className="p-4 border rounded-lg shadow bg-gray-200 cursor-pointer hover:bg-gray-300 transition flex items-center justify-center text-center"
                onClick={() => setSelectedSubcategory(null)}
              >
                <h3 className="text-lg font-bold">뒤로 가기</h3>
              </div>
            </div>
          )}
        </div>
        {}
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
