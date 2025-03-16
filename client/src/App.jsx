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

  // 기존의 자동 리다이렉트 useEffect 제거!

  if (checkingAuth) return null;

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white">
      <Routes>
        {/* 첫 페이지는 항상 LandingPage */}
        <Route path="/" element={<LandingPage />} />

        {/* 나머지 라우트는 그대로 유지 */}
        <Route path="/home" element={authUser ? <HomePage /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to="/home" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/auth" />} />
        <Route path="/chat/:id" element={authUser ? <ChatPage /> : <Navigate to="/auth" />} />
        <Route path="/admin" element={authUser?.name === "admin" ? <AdminPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
