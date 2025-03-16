import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import { useAuthStore } from "./store/useAuthStore";
import { useNotificationStore } from "./store/useNotificationStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { initializeSocket, getSocket } from "./socket/socket.client";
import { updateMatchesFromNotifications } from "./store/useMatchStore"; // 추가된 import

function App() {
  const { checkAuth, authUser, checkingAuth } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      initializeSocket(authUser._id);
      const socket = getSocket();
  
      socket.on("connect", () => console.log("App socket connected:", socket.id));
  
      // 멘티에게만 chatResponse 이벤트 처리
      socket.on("chatResponse", ({ mentorId, status, mentorName, mentorImage }) => {
        if (authUser.role === "mentee") { // 멘티인 경우에만 알림 추가
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
        if (authUser.role === "mentor") { // 멘토인 경우에만 알림 추가
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
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right, #f0f0f0_1px, transparent_1px),linear_gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/auth" replace={false} />} />
        <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to="/" replace={false} />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/auth" replace={false} />} />
        <Route path="/chat/:id" element={authUser ? <ChatPage /> : <Navigate to="/auth" replace={false} />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;