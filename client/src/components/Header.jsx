import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { useNotificationStore } from "../store/useNotificationStore";
import { User, LogOut, Menu, Bell } from "lucide-react";
import { getSocket } from "../socket/socket.client";

export const Header = () => {
  const { authUser, logout } = useAuthStore();
  const { notifications, removeNotification, respondToChatRequest } = useNotificationStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const notificationDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRespond = (requestId, status) => {
    try {
      const socket = getSocket();
      respondToChatRequest(requestId, status, socket);
    } catch (err) {
      console.error("Failed to respond to chat request:", err);
    }
  };

  return (
    <header className='bg-white shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          <div className='flex items-center'>
            <Link to='/home' className='flex items-center space-x-2'>
              <img
                src="/shift.png"
                className='w-8 h-8 object-contain'
                alt='Shift Logo'
              />
              <span className='text-2xl font-bold text-black hidden sm:inline'>STO | Metnor Match</span>
            </Link>
          </div>

          <div className='hidden md:flex items-center space-x-4'>
            {authUser ? (
              <>
                <div className='relative' ref={notificationDropdownRef}>
                  <button
                    onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                    className='relative text-black focus:outline-none'
                  >
                    <Bell className='size-6' />
                    {notifications.length > 0 && (
                      <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full'>
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  {notificationDropdownOpen && (
                    <div className='absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10'>
                      <div className='p-2'>
                        {notifications.length === 0 ? (
                          <p className='text-gray-500 text-center text-sm'>No alert.</p>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className='p-2 border-b border-gray-200 flex justify-between items-center'
                            >
                              <p className='text-sm text-gray-700'>{notif.message}</p>
                              {notif.requestId && (
                                <div className='space-x-2'>
                                  <button
                                    onClick={() => handleRespond(notif.requestId, 'accepted')}
                                    className='text-green-500 hover:underline text-xs'
                                  >
                                    accept
                                  </button>
                                  <button
                                    onClick={() => handleRespond(notif.requestId, 'declined')}
                                    className='text-red-500 hover:underline text-xs'
                                  >
                                    decline
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className='relative' ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className='flex items-center space-x-2 focus:outline-none'
                  >
                    <img
                      src={authUser.image || "/avatar.png"}
                      className='h-10 w-10 object-cover rounded-full border-2 border-gray-300'
                      alt='User image'
                    />
                    <span className='text-black font-medium'>{authUser.name}</span>
                  </button>
                  {dropdownOpen && (
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10'>
                      <Link
                        to='/profile'
                        className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center'
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className='mr-2' size={16} />
                        Profile
                      </Link>
                      <button
                        onClick={logout}
                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center'
                      >
                        <LogOut className='mr-2' size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to='/auth'
                  className='text-black hover:text-gray-600 transition duration-150 ease-in-out'
                >
                  Login
                </Link>
                <Link
                  to='/auth'
                  className='bg-black text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition duration-150 ease-in-out'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className='md:hidden'>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='text-black focus:outline-none'
            >
              <Menu className='size-6' />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className='md:hidden bg-white'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            {authUser ? (
              <>
                <Link
                  to='/profile'
                  className='block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-100'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/auth");
                  }}
                  className='block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-100'
                >
                  <LogOut size={16} className='inline mr-2' />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/auth'
                  className='block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-100'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to='/auth'
                  className='block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-100'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};