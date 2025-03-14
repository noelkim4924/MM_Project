import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { disconnectSocket, initializeSocket } from '../socket/socket.client';

export const useAuthStore = create((set) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,

  signup: async (signupData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post('/auth/signup', signupData);
      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id);
      toast.success('Signup successful');
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  login: async (loginData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post('/auth/login', loginData);
      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id);
      toast.success('Logged in successful');
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    console.log("Starting logout process");
    try {
      const res = await axiosInstance.post("/auth/logout");
      console.log("Logout response:", res);
      disconnectSocket();
      if (res.status === 200) {
        set({ authUser: null });
        
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data);
      toast.error(error.response.data.message || "Something went wrong");
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      initializeSocket(res.data.user._id);
      set({ authUser: res.data.user });
    } catch (error) {
      set({ authUser: null });
      console.log(error);
    } finally {
      set({ checkingAuth: false });
    }
  },
}));