import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { useNotificationStore } from "./useNotificationStore";

export const useMatchStore = create((set) => ({
  matches: [],
  isLoadingMyMatches: false,
  isLoadingUserProfiles: false,
  userProfiles: [],

  getMyMatches: async () => {
    const { authUser } = useAuthStore.getState(); // 로그인 상태 확인
    if (!authUser) return; // 로그인한 유저가 없으면 요청 안 보냄

    set({ isLoadingMyMatches: true });
    try {
      const res = await axiosInstance.get("/matches/my-matches");
      set({ matches: res.data.matches || [] });
    } catch (err) {
      console.error("Error fetching matches:", err);
      set({ matches: [] });
      if (err.response?.status === 401) return; // 인증 오류 메시지 출력 안 함
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoadingMyMatches: false });
    }
  },

  getUserProfiles: async () => {
    const { authUser } = useAuthStore.getState(); // 로그인 상태 확인
    if (!authUser) return; // 로그인한 유저가 없으면 요청 안 보냄

    try {
      set({ isLoadingUserProfiles: true });
      const res = await axiosInstance.get("/matches/user-profiles");
      set({ userProfiles: res.data.users || [] });
    } catch (error) {
      set({ userProfiles: [] });
      if (error.response?.status === 401) return; // 인증 오류 메시지 출력 안 함
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoadingUserProfiles: false });
    }
  },

  addMatchFromNotification: async (mentorId, mentorName, mentorImage) => {
    try {
      // 백엔드에 매칭 추가 요청
      await axiosInstance.post("/matches/add", { mentorId });
      set((state) => {
        const existingMatch = state.matches.find((match) => match._id === mentorId);
        if (!existingMatch) {
          return {
            matches: [
              ...state.matches,
              { _id: mentorId, name: mentorName, image: mentorImage },
            ],
          };
        }
        return state;
      });
    } catch (err) {
      console.error("Error adding match:", err);
    }
  },
}));

export const updateMatchesFromNotifications = () => {
  const notificationStore = useNotificationStore.getState();
  const matchStore = useMatchStore.getState();
  notificationStore.notifications.forEach((notif) => {
    if (
      notif.status === "accepted" && 
      notif.mentorId && 
      !matchStore.matches.find((m) => m._id === notif.mentorId)
    ) {
      useMatchStore.getState().addMatchFromNotification(
        notif.mentorId,
        notif.mentorName,
        notif.mentorImage
      );
    }
  });
};
