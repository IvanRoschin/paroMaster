'use client';

import { FaHeart, FaRegHeart } from 'react-icons/fa';

import { useFavorites } from '@/context/FavoritesContext';
import { IGoodUI } from '@/types/IGood';

interface FavoriteButtonProps {
  good: IGoodUI;
}

export default function FavoriteButton({ good }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(good._id);

  return (
    <button
      onClick={() => toggleFavorite(good)}
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
