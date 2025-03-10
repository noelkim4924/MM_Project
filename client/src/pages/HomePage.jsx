import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useMatchStore } from "../store/useMatchStore";
import {Header} from "../components/Header";
import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header'; // Import the Header component

const HomePage = () => {
  const { isLoadingUserProfiles, getUserProfiles, userProfiles } = useMatchStore();

  useEffect(() => {
    getUserProfiles();
  }, [getUserProfiles]);

  console.log("User Profiles: ", userProfiles);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout button clicked");
    logout().then(() => {
      navigate('/auth', { replace: false });
    });
  };

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden'>
    <Sidebar />
    <div className='flex-grow flex flex-col overflow-hidden'>
				<Header />
        </div>

      </div>
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