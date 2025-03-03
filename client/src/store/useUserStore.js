import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useUserStore = create((set) => ({
  loading: false,

  updateProfile: async (data) => {
    try {
      console.log("Updating profile with data:", data);
      set({ loading: true });
      const res = await axiosInstance.put("/users/update", data);
      console.log("Backend response:", res.data);
      if (res.data && res.data.user) {
        useAuthStore.getState().setAuthUser(res.data.user);
        toast.success(res.data.message || "Profile updated successfully");
      } else {
        console.warn("Unexpected response format:", res.data);
        toast.success("Profile updated successfully"); // 기본 성공 메시지
      }
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      toast.error(error.response?.data.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));