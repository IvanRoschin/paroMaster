// stores/userStore.ts
import { create } from 'zustand';

import { IUser, SessionUser } from '@/types/IUser';

export interface UserState {
  user: SessionUser | null;
  setUser: (user: SessionUser) => void;
  updateField: (field: keyof IUser, value: any) => void;
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: user => set({ user }),
  updateField: (field, value) =>
    set(state => ({
      user: state.user ? { ...state.user, [field]: value } : null,
    })),
}));
