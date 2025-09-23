'use client';

import { create } from 'zustand';

interface TestimonialModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useTestimonialModal = create<TestimonialModalStore>(set => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useTestimonialModal;
