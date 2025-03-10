import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useProfileStore = create((set) => ({
  profile: null,
  loading: false,

  fetchProfile: async (userId) => {
    try {
      set({ loading: true });
      console.log('Fetching profile for user ID:', userId);
      const response = await axiosInstance.get(`/user_profiles/${userId}`);
      set({ profile: response.data });
      toast.success('Profile fetched successfully');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error(error.response?.data?.message || 'Error fetching user profile');
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (userId, profileData) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.put(`/user_profiles/${userId}`, profileData);
      set({ profile: response.data });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      set({ loading: false });
    }
  },
}));