import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import AdminPage from "./pages/AdminPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, authUser, checkingAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    
    if (location.pathname === "/") {
      if (authUser?.name === "admin") {
        navigate("/admin");
      } else if (authUser) {
        navigate("/home");
      }
    }
  }, [authUser, navigate, location.pathname]);

  if (checkingAuth) return null;

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white">
      <Routes>
      <Route
  path="/"
  element={
    !authUser
      ? // 유저가 null이면 로그인 화면으로
        <Navigate to="/auth" />
      : authUser.name === "admin"
      ? // admin이면 /admin
        <Navigate to="/admin" />
      : // 멘토/멘티 등 일반 유저면 HomePage
        <HomePage />
  }
/>
        <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/auth" />} />
        <Route path="/chat/:id" element={authUser ? <ChatPage /> : <Navigate to="/auth" />} />
        <Route path="/admin" element={authUser?.name === "admin" ? <AdminPage /> : <Navigate to="/" />} />
        <Route path="/" element={<LandingPage />} /> {/* 랜딩 페이지 */}
        <Route path="/home" element={authUser ? <HomePage /> : <Navigate to="/" />} /> {/* 홈 페이지 */}
        <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to="/home" />} /> {/* 인증 페이지 */}
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/auth" />} /> {/* 프로필 페이지 */}
        <Route path="/chat/:id" element={authUser ? <ChatPage /> : <Navigate to="/auth" />} /> {/* 채팅 페이지 */}
        <Route path="/admin" element={authUser?.name === "admin" ? <AdminPage /> : <Navigate to="/" />} /> {/* 관리자 페이지 */}
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
