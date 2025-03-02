import {create} from 'zustand';

export const useAuthStore = create((set) => ({

  authUserName : "Noel",
  authUserLastName : "Kim"

}));