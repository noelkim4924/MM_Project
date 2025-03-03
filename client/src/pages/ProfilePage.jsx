import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const [user, setUser] = useState({
    name: '',
    age: '',
    gender: '',
    bio: '',
    availability: [],
    categories: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      setUser({
        name: authUser.name,
        age: authUser.age,
        gender: authUser.gender,
        bio: authUser.bio || '',
        availability: authUser.availability || [],
        categories: authUser.categories || [],
      });
    }
  }, [authUser]);

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-green-400 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center">
          <span className="material-icons text-gray-700 text-6xl">account_circle</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">User Profile</h2>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Name:</span>
            <span className="text-gray-900">{user.name}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Age:</span>
            <span className="text-gray-900">{user.age}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Gender:</span>
            <span className="text-gray-900">{user.gender}</span>
          </div>

          <div className="border-b pb-2">
            <span className="font-medium text-gray-700 block">Bio:</span>
            <p className="text-gray-900">{user.bio}</p>
          </div>
        </div>

        {/* Availability Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Availability</h3>
          <div className="space-y-2">
            {user.availability.map((time, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded-lg shadow-sm">
                <p className="text-gray-900">{time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Categories</h3>
          <div className="space-y-2">
            {user.categories.map((category, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded-lg shadow-sm">
                <p className="text-gray-900">{category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Home Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleHomeClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;