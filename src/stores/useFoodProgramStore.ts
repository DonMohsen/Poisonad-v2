import { create } from 'zustand';
import { FoodProgramResponse } from '@/types/food-response-types';

interface FoodProgramState {
  data: FoodProgramResponse | null;
  setData: (data: FoodProgramResponse | null) => void;
  clearData: () => void;
}

const useFoodProgramStore = create<FoodProgramState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
  clearData: () => set({ data: null }),
}));

export default useFoodProgramStore;
