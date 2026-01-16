'use client';
import { useCallback } from 'react';

import { useModalStore } from '@/app/store/modalStore';

export function useModal(name: string) {
  const { modals, openModal, closeModal, toggleModal } = useModalStore();
  const isOpen = modals[name] ?? false;

  const open = useCallback(() => openModal(name), [name, openModal]);
  const close = useCallback(() => closeModal(name), [name, closeModal]);
  const toggle = useCallback(() => toggleModal(name), [name, toggleModal]);

  return { isOpen, open, close, toggle };
}
