import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(""); // Default to "18+"
  const [role, setRole] = useState("");
  const [isAgeChecked, setIsAgeChecked] = useState(false); // Track checkbox state

  const { signup, loading } = useAuthStore();

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        signup({ name, email, password, gender, age, role });
      }}
    >
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

      {/* EMAIL */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
      </div>

      {/* PASSWORD */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
      </div>

      {/* AGE CHECKBOX */}
      <div>
        <div className="flex items-center">
          <input
            id="age-checkbox"
            name="age-checkbox"
            type="checkbox"
            checked={isAgeChecked}
            onChange={(e) => {
              setIsAgeChecked(e.target.checked);
              setAge(e.target.checked ? "19+" : "");
            }}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
          />
          <label htmlFor="age-checkbox" className="ml-2 block text-sm text-gray-900">
            I am at least 19 years of age
          </label>
        </div>
      </div>

      {/* GENDER */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Your Gender</label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              id="male"
              name="gender"
              type="radio"
              value="male"
              checked={gender === "male"}
              onChange={(e) => setGender(e.target.value)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <label htmlFor="male" className="ml-2 block text-sm text-gray-900">
              Male
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="female"
              name="gender"
              type="radio"
              value="female"
              checked={gender === "female"}
              onChange={(e) => setGender(e.target.value)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <label htmlFor="female" className="ml-2 block text-sm text-gray-900">
              Female
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="other"
              name="gender"
              type="radio"
              value="other"
              checked={gender === "other"}
              onChange={(e) => setGender(e.target.value)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <label htmlFor="other" className="ml-2 block text-sm text-gray-900">
              Other
            </label>
          </div>
        </div>
      </div>

      {/* ROLE */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Your Role</label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              id="mentor"
              name="role"
              type="radio"
              value="mentor"
              checked={role === "mentor"}
              onChange={(e) => setRole(e.target.value)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <label htmlFor="mentor" className="ml-2 block text-sm text-gray-900">
              Mentor
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="mentee"
              name="role"
              type="radio"
              value="mentee"
              checked={role === "mentee"}
              onChange={(e) => setRole(e.target.value)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <label htmlFor="mentee" className="ml-2 block text-sm text-gray-900">
              Mentee
            </label>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            }`}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;