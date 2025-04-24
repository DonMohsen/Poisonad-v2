// stores/userStore.ts
import { UserProfile } from '@/types/userInfo';
import {create} from 'zustand';


interface UserStore {
  user: UserProfile | null;
  setUser: (userData: UserProfile) => void;
  logout: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
}));

export default useUserStore;
