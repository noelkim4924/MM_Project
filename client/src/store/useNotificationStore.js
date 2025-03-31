import { create } from 'zustand';
import { toast } from 'react-hot-toast';

export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (notification) => {
    set((state) => ({
      notifications: [...state.notifications, { id: Date.now(), ...notification }],
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  respondToChatRequest: (requestId, status, socket) => {
    socket.emit("respondChat", { requestId, status });
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.requestId !== requestId),
    }));
    toast.success(`The chat request has been ${status === 'accepted' ? 'accepted' : 'declined'}.`);
  },
}));