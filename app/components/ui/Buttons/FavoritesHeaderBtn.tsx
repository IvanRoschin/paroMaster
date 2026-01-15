'use client';

import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FaHeart } from 'react-icons/fa';

import { useModal } from '@/app/hooks/useModal';
import { useAppStore } from '@/app/store/appStore';
import { FavoritesModal } from '@/components/modal/FavoritesModal';
import { UserRole } from '@/types/IUser';

interface FavoritesHeaderButtonProps {
  role?: string | UserRole;
}

const FavoritesHeaderButton: React.FC<FavoritesHeaderButtonProps> = ({
  role,
}) => {
  const { favorites } = useAppStore();
  const { open, isOpen, close } = useModal('favorites');

  if (favorites.favorites.length === 0 && role === UserRole.GUEST) return null;

  return (
    <>
      <button
        onClick={open}
        className="relative flex items-center justify-center"
      >
        <FaHeart className="w-7 h-7 text-red-500 hover:text-red-600 transition-colors" />

        <AnimatePresence>
          {favorites.favorites.length > 0 && (
            <motion.span
              key={favorites.favorites.length} // ключ меняется при изменении числа
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="
                absolute -top-2 -right-2
                w-5 h-5
                flex items-center justify-center
                rounded-full
                bg-orange-500 text-white
                text-[10px] font-semibold
              "
            >
              {favorites.favorites.length}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {isOpen && <FavoritesModal isOpen={isOpen} onClose={close} />}
    </>
  );
};

export default dynamic(() => Promise.resolve(FavoritesHeaderButton), {
  ssr: false,
});
