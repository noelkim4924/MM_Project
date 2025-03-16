import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useNotificationStore } from './useNotificationStore';

export const useMatchStore = create((set) => ({
  matches: [],
  isLoadingMyMatches: false,

  getMyMatches: async () => {
    set({ isLoadingMyMatches: true });
    try {
      const res = await axiosInstance.get('/matches/my-matches');
      set({ matches: res.data.matches || [] });
    } catch (err) {
      console.error("Error fetching matches:", err);
      set({ matches: [] });
    } finally {
      set({ isLoadingMyMatches: false });
    }
  },

  addMatchFromNotification: async (mentorId, mentorName, mentorImage) => {
    try {
      // 백엔드에 매칭 추가 요청
      await axiosInstance.post('/matches/add', { mentorId });
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
    if (notif.status === "accepted" && notif.mentorId && !matchStore.matches.find((m) => m._id === notif.mentorId)) {
      useMatchStore.getState().addMatchFromNotification(notif.mentorId, notif.mentorName, notif.mentorImage);
    }
  });
};