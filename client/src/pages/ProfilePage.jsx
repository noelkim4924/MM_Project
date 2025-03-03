import React, { useEffect, useState } from 'react';

// Assuming you have a function to get the current user's data from an API or state
const ProfilePage = () => {
  // State to hold user data
  const [user, setUser] = useState({
    name: '',
    age: '',
    gender: '',
    bio: '',
    availability: [],
    categories: [],
  });

  // Fetch the user's data (You can replace this with actual fetching logic)
  useEffect(() => {
    // Example: Replace this with actual logic to fetch user data
    const fetchedUserData = {
      name: 'John Doe',
      age: 'over 18',
      gender: 'male',
      bio: "I'm John Doe, I love coding and learning new tech.",
      availability: [
        'Monday: 9 AM - 5 PM',
        'Tuesday: 10 AM - 4 PM',
        'Wednesday: 9 AM - 3 PM',
        'Thursday: 9 AM - 5 PM',
        'Friday: 10 AM - 4 PM',
      ],
      categories: [
        'Web Development',
        'Mobile Development',
        'Database Management',
        'Machine Learning',
        'Cloud Computing',
      ],
    };
    setUser(fetchedUserData);
  }, []);

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
      </div>
    </div>
  );
};

export default ProfilePage;
