// stores/userStore.ts
import { create } from 'zustand';

const allowedSelfIds = [104, 211]; // ← add allowed IDs here

interface UseSelfIdType {
  selfId: number|null;
  setSelfId: (id: number) => void;
}

const useSelfId = create<UseSelfIdType>((set) => ({
  selfId: null, // default to first allowed ID
  setSelfId: (id: number) => {
    if (allowedSelfIds.includes(id)) {
      set({ selfId: id });
    } else {
      console.warn(`Invalid selfId: ${id}. Must be one of [${allowedSelfIds.join(', ')}].`);
    }
  },
}));

export default useSelfId;
