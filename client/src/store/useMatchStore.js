import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore"; // 🟢 로그인 상태 가져오기

export const useMatchStore = create((set) => ({
  matches: [], 
  isLoadingMyMatches: false,
  isLoadingUserProfiles: false,
  userProfiles: [],
  swipeFeedback: null,

  getMyMatches: async () => {
    const { authUser } = useAuthStore.getState(); // 🟢 로그인 상태 확인

    if (!authUser) return; // 🛑 로그인한 유저가 없으면 요청 안 보냄

    try {
      set({ isLoadingMyMatches: true });
      const res = await axiosInstance.get("/matches");
      set({ matches: res.data.matches || [] }); 
    } catch (error) {
      set({ matches: [] });
      if (error.response?.status === 401) return; // 🛑 인증 오류 메시지 출력 안 함
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoadingMyMatches: false });
    }
  },

  getUserProfiles: async () => {
    const { authUser } = useAuthStore.getState(); // 🟢 로그인 상태 확인

    if (!authUser) return; // 🛑 로그인한 유저가 없으면 요청 안 보냄

    try {
      set({ isLoadingUserProfiles: true });
      const res = await axiosInstance.get("/matches/user-profiles");
      set({ userProfiles: res.data.users || [] }); 
    } catch (error) {
      set({ userProfiles: [] });
      if (error.response?.status === 401) return; // 🛑 인증 오류 메시지 출력 안 함
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoadingUserProfiles: false });
    }
  },
}));
