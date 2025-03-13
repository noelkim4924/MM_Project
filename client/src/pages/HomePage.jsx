import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🟢 추가
import Sidebar from "../components/Sidebar";
import { useMatchStore } from "../store/useMatchStore";
import { useAuthStore } from "../store/useAuthStore"; // 🟢 추가
import { Header } from "../components/Header";

const HomePage = () => {
  const { isLoadingUserProfiles, getUserProfiles, userProfiles } = useMatchStore();
  const { authUser } = useAuthStore(); // 🟢 현재 로그인한 유저 정보 가져오기
  const navigate = useNavigate(); // 🟢 네비게이션 훅

  useEffect(() => {
    getUserProfiles();
  }, [getUserProfiles]);

  // 🟢 어드민이면 자동으로 /admin으로 이동
  useEffect(() => {
    if (authUser?.name === "admin") {
      navigate("/admin"); 
    }
  }, [authUser, navigate]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
      <Sidebar />
      <div className="flex-grow flex flex-col overflow-hidden">
        <Header />
      </div>
    </div>
  );
};

export default HomePage;
