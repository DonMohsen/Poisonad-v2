import { create } from 'zustand';
import { ReserveWithWeekStart } from '@/types/reserveWithWeekStart';

interface ReserveState {
  weekReserveData: ReserveWithWeekStart | null;
  loading: boolean;
  error: string | null;
  setWeekReserveData: (data: ReserveWithWeekStart) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
    logout: () => void;

}

const useReserveWithStartWeekStore = create<ReserveState>((set) => ({
  weekReserveData: null,
  loading: false,
  error: null,
  setWeekReserveData: (data) => set({ weekReserveData: data }),
  setLoading: (value) => set({ loading: value }),
  setError: (error) => set({ error }),
    logout: () => set({ weekReserveData: null }),

}));

export default useReserveWithStartWeekStore;
