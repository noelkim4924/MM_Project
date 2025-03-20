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

// useUserStore.js (수정 후)
updateProfile: async (data) => {
  try {
    set({ loading: true });
    console.log("Updating profile with data:", data);
    const res = await axiosInstance.put("/users/update", data);
    
    // ✅ 디버깅: 응답 코드/데이터 확인
    console.log("updateProfile response status:", res.status);
    console.log("updateProfile response data:", res.data);

    if (res.status === 200 && res.data.success) {
      // 정상
      useAuthStore.getState().setAuthUser(res.data.data);
      set({ profile: res.data.data });
      toast.success(res.data.message || "Profile updated successfully");
    } else {
      // 혹시 success=false 이거나 status 200인데 뭔가 문제인 경우
      console.warn("Unexpected success=false or missing data:", res.data);
      toast.error(res.data.message || "Something went wrong");
    }
  } catch (error) {
    console.error("Profile update error:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    set({ loading: false });
  }
},


  requestCategoryVerification: async () => {
    try {
      set({ loading: true });
      // 👇 PUT -> POST로 변경
      const res = await axiosInstance.post("/users/request-category-verification");
      toast.success("Verification request sent to admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));
