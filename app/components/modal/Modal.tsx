'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  body: React.ReactNode;
  disabled?: boolean;
}

export default function Modal({ isOpen, onClose, body, disabled }: ModalProps) {
  const [showModal, setShowModal] = useState(isOpen);
  const openedRef = useRef(false); // защита от двойного mount в StrictMode

  useEffect(() => {
    // предотвращает двойной старт анимации в StrictMode
    if (!openedRef.current) {
      openedRef.current = true;
      setShowModal(isOpen);
    } else {
      setShowModal(isOpen);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) return;

    setShowModal(false);

    setTimeout(() => {
      onClose();
    }, 250);
  }, [disabled, onClose]);

  // ESC
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', onEsc);
    }

    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
        showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={e => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`relative bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl transform transition-all duration-200 ${
          showModal
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1 border rounded-full border-neutral-400 hover:border-primaryAccentColor transition"
        >
          <IoMdClose size={18} />
        </button>

        {body}
      </div>
    </div>
  );
}
