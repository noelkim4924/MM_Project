import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가

const HomePage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLogout = () => {
    console.log("Logout button clicked");
    logout().then(() => {
      navigate('/auth', { replace: false }); // push로 이동
    });
  };

  return (
    <div>
      Homepage
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default HomePage;