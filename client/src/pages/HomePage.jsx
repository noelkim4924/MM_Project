import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header'; // Import the Header component

const HomePage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout button clicked");
    logout().then(() => {
      navigate('/auth', { replace: false });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header /> {/* Add the Header component here */}
      <div className="flex-grow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Homepage</h2>
        </div>

      </div>
    </div>
  );
};

export default HomePage;