'use client';
import { create } from 'zustand';

interface ModalStore {
  modals: Record<string, boolean>;

  openModal: (name: string) => void;
  closeModal: (name: string) => void;
  toggleModal: (name: string) => void;
}

export const useModalStore = create<ModalStore>(set => ({
  modals: {},

  openModal: name =>
    set(state => ({ modals: { ...state.modals, [name]: true } })),
  closeModal: name =>
    set(state => ({ modals: { ...state.modals, [name]: false } })),
  toggleModal: name =>
    set(state => ({
      modals: { ...state.modals, [name]: !state.modals[name] },
    })),
}));
