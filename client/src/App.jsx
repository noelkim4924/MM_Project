import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import AdminPage from "./pages/AdminPage";
import { useAuthStore } from "./store/useAuthStore";
import { useNotificationStore } from "./store/useNotificationStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { initializeSocket, getSocket } from "./socket/socket.client";
import { updateMatchesFromNotifications } from "./store/useMatchStore";

function App() {
  const { checkAuth, authUser, checkingAuth } = useAuthStore();
  const { addNotification } = useNotificationStore();
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

  // 소켓 초기화를 authUser가 로드된 후에 진행 (localStorage 의존 제거)
  useEffect(() => {
    if (authUser && authUser._id) {
      initializeSocket(authUser._id);
      const socket = getSocket();

      socket.on("connect", () => console.log("App socket connected:", socket.id));

      // 멘티인 경우: 채팅 요청에 대한 응답 이벤트 처리
      socket.on("chatResponse", ({ mentorId, status, mentorName, mentorImage }) => {
        if (authUser.role === "mentee") {
          console.log("App received chatResponse:", { mentorId, status, mentorName });
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
        }
      });

      // 멘토인 경우: 새로운 채팅 요청 이벤트 처리
      socket.on("chatRequest", ({ menteeId, menteeName, requestId }) => {
        if (authUser.role === "mentor") {
          console.log("App received chatRequest:", { menteeId, menteeName, requestId });
          addNotification({
            message: `${menteeName}님으로부터 새로운 채팅 요청이 도착했습니다!`,
            menteeId,
            requestId,
          });
        }
      });

      return () => {
        socket.off("chatRequest");
        socket.off("chatResponse");
      };
    }
  }, [authUser, addNotification]);

  if (checkingAuth) return null;

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={authUser ? <HomePage /> : <Navigate to="/" />} />
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
