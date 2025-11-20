'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

import { FavoritesModal } from '@/components/modal/FavoritesModal';
import { useFavorites } from '@/context/FavoritesContext';

const FavoritesHeaderButton = () => {
  const { favorites } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);

  if (favorites.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-center"
      >
        <FaHeart className="w-7 h-7 text-red-500 hover:text-red-600 transition-colors" />
        <span
          className="
          absolute -top-2 -right-2
          w-5 h-5
          flex items-center justify-center
          rounded-full
          bg-primaryAccentColor text-white
          text-[10px] font-semibold
        "
        >
          {favorites.length}
        </span>
      </button>
      {isOpen && (
        <FavoritesModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(FavoritesHeaderButton), {
  ssr: false,
});
