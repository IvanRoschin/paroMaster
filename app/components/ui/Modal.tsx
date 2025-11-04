'use client';

import { useCallback, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

interface ModalProps {
  body?: React.ReactElement | string;
  isOpen?: boolean;
  onClose: () => void;
  disabled?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  body,
  disabled,
  children,
}: ModalProps & { children?: React.ReactNode }) => {
  const [showModal, setShowModal] = useState(isOpen);
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  useEffect(() => {
    const onEscClick = (e: KeyboardEvent) => {
      if (e.code === 'Escape') handleClose();
    };

    window.addEventListener('keydown', onEscClick);

    return () => {
      window.removeEventListener('keydown', onEscClick);
    };
  }, [handleClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.currentTarget === e.target) handleClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`relative w-full max-w-2xl mx-auto my-10 rounded-2xl bg-white p-6 shadow-2xl transform transition-all duration-300 ${
          showModal
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-10 scale-95 opacity-0'
        }`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {children ? (
          children
        ) : (
          <button
            onClick={() => handleClose()}
            className="absolute right-4 top-4 p-1 border rounded-full border-neutral-400 hover:border-primaryAccentColor hover:opacity-70 transition"
          >
            <IoMdClose size={18} />
          </button>
        )}

        {/* Content*/}
        {body}
      </div>
    </div>
  );
};

export default Modal;
