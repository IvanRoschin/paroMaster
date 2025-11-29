// stores/refreshStore.ts
import { create } from 'zustand';

export interface RefreshState {
  key: number;
  trigger: () => void;
}

export const useRefreshStore = create<RefreshState>(set => ({
  key: 0,
  trigger: () => set(state => ({ key: state.key + 1 })),
}));
