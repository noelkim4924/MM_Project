import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import Sidebar from "../components/Sidebar";
import { axiosInstance } from "../lib/axios";
import UserDetailModal from "../components/UserDetailModal";
import { initializeSocket, getSocket } from "../socket/socket.client";
import { useNotificationStore } from "../store/useNotificationStore";
import { updateMatchesFromNotifications } from "../store/useMatchStore"; // 매칭 업데이트 함수

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState(["Home"]);
  const { addNotification } = useNotificationStore();

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

  const iconPaths = [
    "/public/icons/career-growth.png",
    "/public/icons/professional-dev.png",
    "/public/icons/diversity.png",
    "/public/icons/software-dev.png",
    "/public/icons/data-ai.png",
    "/public/icons/product-design.png",
    "/public/icons/career-leadership.png",
    "/public/icons/diversity-tech.png",
  ];

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("User ID from localStorage:", userId);
    if (userId) {
      initializeSocket(userId);
    } else {
      console.warn("No userId found, socket not initialized.");
    }
  
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  
    let socket;
    try {
      socket = getSocket();
      socket.on("connect", () => console.log("HomePage socket connected"));
      socket.on("chatRequest", ({ menteeId, menteeName, requestId }) => {
        console.log("Received chatRequest:", { menteeId, menteeName, requestId });
        addNotification({
          message: `${menteeName}님으로부터 새로운 채팅 요청이 도착했습니다!`,
          menteeId,
          requestId,
        });
      });
  
      socket.on("chatResponse", ({ mentorId, status, mentorName, mentorImage }) => {
        console.log("Received chatResponse:", { mentorId, status, mentorName, mentorImage });
        addNotification({
          message: `${mentorName}님이 채팅 요청을 ${status === "accepted" ? "수락" : "거절"}했습니다.`,
          mentorId,
          status,
          mentorName,
          mentorImage,
        });
        if (status === "accepted") {
          updateMatchesFromNotifications();
        }
      });
    } catch (err) {
      console.error("Socket not initialized yet:", err);
    }
  
    return () => {
      if (socket) {
        socket.off("chatRequest");
        socket.off("chatResponse");
      }
    };
  }, [addNotification]);

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
                onError={(e) => console.error(`Image load failed: ${e.target.src}`)}
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