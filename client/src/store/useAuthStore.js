import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({

  authUser: null,
  checkingAuth: true,
  loading: false,

  signup : async(signupData)=>{
    try {
      set({loading:true})
      const res = await axiosInstance.post('/auth/signup',signupData);
      set({authUser:res.data.user})
      toast.success('Signup successful')
    } catch (error) {
      toast.error(error.response.data.message || "something went wrong")
    } finally {
      set({loading:false})
    }
  },
  login : async(LoginData)=>{
    try {
      set({loading:true})
      const res = await axiosInstance.post('/auth/login',LoginData);
      set({authUser:res.data.user})
      toast.success('Logged in successful')
    } catch (error) {
      toast.error(error.response.data.message || "something went wrong")
    } finally {
      set({loading:false})
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      if (res.status === 200) set({ authUser: null });
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  },
  

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      set({authUser:res.data.user})
    } catch (error) {
      set({authUser:null})
      console.log(error);
    } finally {
      set({checkingAuth:false})
    }

  }

}));