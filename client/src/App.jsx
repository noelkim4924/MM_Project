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

  useEffect(() => {
    if (authUser) {
      initializeSocket(authUser._id);
      const socket = getSocket();

      socket.on("connect", () => console.log("App socket connected:", socket.id));

      // 멘티에게만 chatResponse 이벤트 처리
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

      // 멘토는 chatRequest 이벤트만 처리
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
