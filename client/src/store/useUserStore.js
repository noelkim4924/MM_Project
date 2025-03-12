import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useUserStore = create((set) => ({
  profile: null,
  loading: false,

  fetchProfile: async (userId) => {
    try {
      set({ loading: true });
      console.log("fetchProfile called with userId:", userId);
      const response = await axiosInstance.get(`/users/${userId}`);
      set((state) => {
        
        if (JSON.stringify(state.profile) !== JSON.stringify(response.data)) {
          toast.success("Profile fetched successfully");
        }
        return { profile: response.data };
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error(error.response?.data?.message || "Error fetching user profile");
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (data) => {
    try {
      console.log("Updating profile with data:", data);
      set({ loading: true });
      const res = await axiosInstance.put("/users/update", data);
      console.log("Backend response:", res.data);
      if (res.data && res.data.user) {
        useAuthStore.getState().setAuthUser(res.data.user);
        set({ profile: res.data.user });
        toast.success(res.data.message || "Profile updated successfully");
      } else {
        console.warn("Unexpected response format:", res.data);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));