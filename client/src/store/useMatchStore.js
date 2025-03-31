// src/store/useMatchStore.js
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
    const { authUser } = useAuthStore.getState();
    if (!authUser) return;

    set({ isLoadingMyMatches: true });
    try {
      const res = await axiosInstance.get("/matches/my-matches");
      set({ matches: res.data.matches || [] });
    } catch (err) {
      console.error("Error fetching matches:", err);
      set({ matches: [] });
      if (err.response?.status === 401) return;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoadingMyMatches: false });
    }
  },

  getUserProfiles: async () => {
    const { authUser } = useAuthStore.getState();
    if (!authUser) return;

    try {
      set({ isLoadingUserProfiles: true });
      const res = await axiosInstance.get("/matches/user-profiles");
      set({ userProfiles: res.data.users || [] });
    } catch (error) {
      set({ userProfiles: [] });
      if (error.response?.status === 401) return;
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoadingUserProfiles: false });
    }
  },

  addMatchFromNotification: async (mentorId, mentorName, mentorImage) => {
    try {
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


  removeMatch: (userId) => {
    set((state) => ({
      matches: state.matches.filter((match) => match._id !== userId),
    }));
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