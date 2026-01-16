'use client';

import { FaHeart, FaRegHeart } from 'react-icons/fa';

import { useAppStore } from '@/app/store/appStore';
import { IGoodUI } from '@/types/IGood';

interface FavoriteButtonProps {
  good: IGoodUI;
}

export default function FavoriteButton({ good }: FavoriteButtonProps) {
  const { favorites } = useAppStore();
  const favorite = favorites.isFavorite(good._id);

  return (
    <button
      onClick={() => favorites.toggleFavorite(good)}
      className={`
        p-2 rounded-md transition-colors
        ${favorite ? ' text-red-500 ' : ' hover:text-red-500'}
      `}
      title={favorite ? 'Улюблений' : 'Додати до улюблених'}
    >
      {favorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
    </button>
  );
}
