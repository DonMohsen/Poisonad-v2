// stores/userStore.ts
import { ReserveWithWeekStart } from '@/types/reserveWithWeekStart';
import {create} from 'zustand';


interface useReserveWithStartWeekType {
  weekReserveData: ReserveWithWeekStart | null;
  setWeekReserveData: (userData: ReserveWithWeekStart) => void;
  logout: () => void;
}

const useReserveWithStartWeekStore = create<useReserveWithStartWeekType>((set) => ({
  weekReserveData: null,
  setWeekReserveData: (userData) => set({ weekReserveData: userData }),
  logout: () => set({ weekReserveData: null }),
}));

export default useReserveWithStartWeekStore;
