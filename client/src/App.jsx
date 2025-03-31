import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import AdminPage from "./pages/AdminPage";
import AdminEditUser from "./components/admin/AdminEditUser";
import PasswordChange from "./components/PasswordChange";
import RequestPasswordReset from "./pages/RequestPasswordReset"; 
import ResetPassword from "./pages/ResetPassword"; 
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
    if (authUser && authUser._id) {
      initializeSocket(authUser._id);
      const socket = getSocket();

      socket.on("connect", () => console.log("App socket connected:", socket.id));

    
      socket.on("chatResponse", ({ mentorId, status, mentorName, mentorImage }) => {
        if (authUser.role === "mentee") {
          console.log("App received chatResponse:", { mentorId, status, mentorName });
          addNotification({
            message: `${mentorName} has ${status === "accepted" ? "accepted" : "declined"} the chat request.`,
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

     
      socket.on("chatRequest", ({ menteeId, menteeName, requestId }) => {
        if (authUser.role === "mentor") {
          console.log("App received chatRequest:", { menteeId, menteeName, requestId });
          addNotification({
            message: `A new chat request has arrived from ${menteeName}!`,
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
        <Route path="/admin/edit-user/:id" element={<AdminEditUser />} />
        <Route path="/change-password" element={authUser ? <PasswordChange /> : <Navigate to="/auth" />} />
        <Route path="/request-password-reset" element={<RequestPasswordReset />} /> 
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
