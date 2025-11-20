'use client';

import { Button, ProductCard } from '@/components';
import { useFavorites } from '@/context/FavoritesContext';

import Modal from './Modal';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      body={
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">
            ❤️ Улюблені товари
          </h2>

          {favorites.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              У вас ще немає улюблених товарів
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(good => (
                <div key={good._id} className="relative">
                  <ProductCard good={good} />
                  <Button
                    type="button"
                    label="Видалити"
                    small
                    outline
                    onClick={() => toggleFavorite(good)}
                    className="absolute top-2 right-2"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              label="Закрити"
              onClick={onClose}
              small
              outline
            />
          </div>
        </div>
      }
    />
  );
};
