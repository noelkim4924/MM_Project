// import { Route, Routes, Navigate } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import AuthPage from './pages/AuthPage';
// import ProfilePage from './pages/ProfilePage';
// import ChatPage from './pages/ChatPage';
// import { useAuthStore } from './store/useAuthStore';
// import { useEffect } from 'react';
// import { Toaster } from 'react-hot-toast';

// function App() {
//   const { checkAuth, authUser, checkingAuth } = useAuthStore();

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   // contextmenu 이벤트 차단 확인
//   useEffect(() => {
//     const handleContextMenu = (e) => {
//       console.log("Context menu triggered");
//     };
//     window.addEventListener('contextmenu', handleContextMenu);
//     return () => window.removeEventListener('contextmenu', handleContextMenu);
//   }, []);

//   if (checkingAuth) return null;

//   return (
//     <div className='absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right, #f0f0f0_1px, transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]'>
//       <Routes>
//         <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/auth" replace={false} />} />
//         <Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to="/" replace={false} />} />
//         <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/auth" replace={false} />} />
//         <Route path='/chat/:id' element={authUser ? <ChatPage /> : <Navigate to="/auth" replace={false} />} />
//       </Routes>
//       <Toaster />
//     </div>
//   );
// }

// export default App;

{/* up code is when we imp matching systmes we will use  */}

import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, authUser, checkingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleContextMenu = (e) => {
      console.log("Context menu triggered");
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  if (checkingAuth) return null;

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right, #f0f0f0_1px, transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/auth" replace={false} />} />
        <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to="/" replace={false} />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/auth" replace={false} />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/auth" replace={false} />} />
        <Route path="/chat/:id" element={authUser ? <ChatPage /> : <Navigate to="/auth" replace={false} />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;