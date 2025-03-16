import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate(); // 🟢 네비게이션 기능 추가

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 🟢 어드민이면 자동으로 /admin으로 리다이렉트
  useEffect(() => {
    if (authUser?.name === "admin") {
      navigate("/admin"); 
    }
  }, [authUser, navigate]);

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
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
