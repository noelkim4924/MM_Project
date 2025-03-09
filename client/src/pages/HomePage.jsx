import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout button clicked");
    logout().then(() => {
      navigate('/auth', { replace: false });
    });
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Homepage</h1>
      <ul className="space-y-2">
        <li>
          <button onClick={goToProfile} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
            Profile
          </button>
        </li>
        <li>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;