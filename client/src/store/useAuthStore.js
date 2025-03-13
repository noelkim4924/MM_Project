import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useMatchStore } from "./useMatchStore"; // 🟢 매칭 상태 가져오기

export const useAuthStore = create((set) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,

  signup: async (signupData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post('/auth/signup', signupData);
      set({ authUser: res.data.user });
      toast.success('Signup successful');
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  login: async (loginData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post('/auth/login', loginData);
      set({ authUser: res.data.user });
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    console.log("Starting logout process");
    try {
      const res = await axiosInstance.post("/auth/logout");
      console.log("Logout response:", res);
      if (res.status === 200) {
        set({ authUser: null });

        // 🛑 로그아웃 시 matches와 userProfiles 초기화
        useMatchStore.getState().matches = [];
        useMatchStore.getState().userProfiles = [];
        useMatchStore.getState().isLoadingMyMatches = false;
        useMatchStore.getState().isLoadingUserProfiles = false;
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      set({ authUser: res.data.user });
    } catch (error) {
      set({ authUser: null });
      console.log(error);
    } finally {
      set({ checkingAuth: false });
    }
  },
}));
