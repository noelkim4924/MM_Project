import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname !== "/") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(/background/background.jpeg)`,
      }}
    >
      
      <div className="absolute inset-0 bg-black opacity-50"></div>

      
      <div className="relative z-10 text-center text-white px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow">
          Connect with{" "}
          <span className="bounce inline-block">
            <span className="text-green-500">Mentors</span>
          </span>{" "}
          &{" "}
          <span className="bounce inline-block">
            <span className="text-blue-400">Mentees</span>
          </span>{" "}
          Worldwide
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          Join thousands of mentors and mentees to share knowledge, grow together, and build meaningful relationships.
        </p>

       
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link
            to="/auth"
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>

      
      <footer className="absolute bottom-0 w-full text-center text-white py-4">
        <p className="text-sm">© 2025 Mentor-Mentee Matching App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;