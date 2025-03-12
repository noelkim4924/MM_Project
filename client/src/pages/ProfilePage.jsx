import { useRef, useState, useEffect } from "react";
import { Header } from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import CategoryDropdown from "../components/CategoryDropdown";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const { profile, fetchProfile, updateProfile, loading } = useUserStore();

  const [name, setName] = useState(authUser?.name || "");
  const [age, setAge] = useState(authUser?.age || "");
  const [gender, setGender] = useState(authUser?.gender || "");
  const [bio, setBio] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(authUser?.image || null);
  const [role, setRole] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (authUser) {
      fetchProfile(authUser._id);
    }
  }, [authUser, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || authUser?.name || "");
      setAge(profile.age || authUser?.age || "");
      setGender(profile.gender || authUser?.gender || "");
      setBio(profile.bio || "");
      setCategories(profile.categories || []);
      setImage(profile.image || authUser?.image || null);
      setRole(profile.role || "");
    }
  }, [profile, authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // age, gender, role은 업데이트에서 제외
    const updatedData = { name, bio, categories, image };
    await updateProfile(updatedData);
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

  const removeCategory = (categoryToRemove) => {
    setCategories(categories.filter((category) => category !== categoryToRemove));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-grow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Your Profile</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* IMAGE */}
              <div className="text-center">
                {image && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={image}
                      alt="User Image"
                      className="w-48 h-48 object-cover rounded-full border-4 border-white drop-shadow-[0px_4px_6px_rgba(0,0,0,0.3)]"
                    />
                  </div>
                )}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Upload Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* NAME */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* AGE - Read Only */}
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <div className="ml-2 text-sm text-red-600">
                  ✉️ To change age, gender, or role, email the admin.
                </div>
              </div>
            <div className="mt-1 text-sm text-gray-500 bg-gray-100 px-3 py-2 border border-gray-300 rounded-md">
              {age || "Not set"}
            </div>

              {/* GENDER - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <div className="mt-1 text-sm text-gray-500 bg-gray-100 px-3 py-2 border border-gray-300 rounded-md">
                  {gender || "Not set"}
                </div>
              </div>

              {/* ROLE - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <div className="mt-1 text-sm text-gray-500 bg-gray-100 px-3 py-2 border border-gray-300 rounded-md">
                  {role || "Not set"}
                </div>
              </div>

              {/* BIO */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    rows="4"
                  />
                </div>
              </div>

              {/* CATEGORIES */}
              <CategoryDropdown
                selectedCategories={categories}
                onCategoryChange={handleCategoryChange}
                onRemoveCategory={removeCategory}
              />

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;