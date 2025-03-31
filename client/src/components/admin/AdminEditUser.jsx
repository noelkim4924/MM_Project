import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import CategoryDropdown from "../CategoryDropdown"; // Import CategoryDropdown

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [role, setRole] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/users/admin/users/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          const userData = res.data.data;
          setUser(userData);
          setName(userData.name);
          setAge(userData.age);
          setGender(userData.gender);
          setBio(userData.bio);
          setCategories(userData.categories || []);
          setImage(userData.image);
          setRole(userData.role);
        } else {
          toast.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  const handleResetImage = async () => {
    try {
      await axios.put(`http://localhost:5001/api/users/admin/users/${id}`, {
        resetImage: true,
      }, { withCredentials: true });
      toast.success("Image reset to default");
      fetchUserDetail(); // 다시 불러오기
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset image");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (newCategories) => {
    setCategories(newCategories);
  };

  const removeCategory = (categoryIdToRemove) => {
    setCategories((prev) =>
      prev.filter((cat) => cat.categoryId !== categoryIdToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { name, age, gender, bio, categories, image, role };
    try {
      await axios.put(`http://localhost:5001/api/users/admin/users/${id}`, updatedData, { withCredentials: true });
      toast.success("User updated successfully");
      navigate(`/admin/edit-user/${id}`); // Reload the page with the current user ID
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Edit User
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <img
                  src={image || "/avatar.png"}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full border mx-auto"
                />
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleResetImage}
                    className="ml-4 inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Reset Image
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    rows="4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <CategoryDropdown
                  selectedCategories={categories}
                  onCategoryChange={handleCategoryChange}
                  onRemoveCategory={removeCategory}
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </form>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditUser;
