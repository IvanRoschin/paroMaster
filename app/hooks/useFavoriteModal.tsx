'use client';

import { create } from 'zustand';

interface FavoriteModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useFavoriteModal = create<FavoriteModal>(set => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useFavoriteModal;
