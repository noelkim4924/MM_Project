import { useRef, useState, useEffect } from "react";
import { Header } from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { useProfileStore } from "../store/useProfileStore";
import CategoryDropdown from "../components/CategoryDropdown"; // Import the new component

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const { profile, fetchProfile, updateProfile: updateProfileStore, loading: profileLoading } = useProfileStore();
  const { updateProfile: updateUserProfile, loading: userLoading } = useUserStore();

  const [name, setName] = useState(authUser?.name || "");
  const [age, setAge] = useState(authUser?.age || "");
  const [gender, setGender] = useState(authUser?.gender || "");
  const [bio, setBio] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(authUser?.image || null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (authUser) {
      fetchProfile(authUser._id);
    }
  }, [authUser, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setCategories(profile.categories || []);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfile({ userId: authUser._id, name, age, gender, image });
    await updateProfileStore(authUser._id, { bio, categories });
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

  if (profileLoading || userLoading) {
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
                    <img src={image} alt="User Image" className="w-48 h-48 object-cover rounded-full border-4 border-white drop-shadow-[0px_4px_6px_rgba(0,0,0,0.3)]" />
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

              {/* AGE - Dropdown */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <div className="mt-1">
                  <select
                    id="age"
                    name="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="">Select Age</option>
                    <option value="under 18">Under 18</option>
                    <option value="18">18</option>
                    <option value="over 18">Over 18</option>
                  </select>
                </div>
              </div>

              {/* GENDER - Dropdown */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
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
                disabled={profileLoading || userLoading}
              >
                {profileLoading || userLoading ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;