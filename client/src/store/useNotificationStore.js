import { create } from 'zustand';
import { toast } from 'react-hot-toast';

export const useNotificationStore = create((set) => ({
  notifications: [], // 알림 목록

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
    toast.success(`채팅 요청을 ${status === 'accepted' ? '수락' : '거절'}했습니다.`);
  },
}));