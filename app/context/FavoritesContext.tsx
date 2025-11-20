'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';

import { toggleFavoriteAction } from '@/actions/customers';
import toPlain from '@/helpers/server/toPlain';
import { IGoodUI } from '@/types/IGood';

interface FavoritesContextProps {
  favorites: IGoodUI[];
  toggleFavorite: (good: IGoodUI) => void;
  isFavorite: (goodId: string) => boolean;
  setFavorites: React.Dispatch<React.SetStateAction<IGoodUI[]>>;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(
  undefined
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favorites, setFavorites] = useState<IGoodUI[]>([]);

  const toggleFavorite = useCallback(async (good: IGoodUI) => {
    let action: 'added' | 'removed' = 'added';

    // Оптимистичное обновление UI
    setFavorites(prev => {
      const exists = prev.find(f => f._id === good._id);
      if (exists) {
        action = 'removed';
        return prev.filter(f => f._id !== good._id);
      }
      return [...prev, toPlain(good)];
    });

    // Показываем мгновенный тост
    if (action === 'added') {
      toast.success(`Товар "${good.title}" додано в улюблені`);
    } else {
      toast('Товар видалено з улюблених');
    }

    try {
      const res = await toggleFavoriteAction(good._id);

      // Если сервер вернул массив favorites — обновляем стейт
      if ('favorites' in res) {
        setFavorites(prev =>
          // Сохраняем только товары, которые остались на сервере
          prev.filter(f => res.favorites.includes(f._id))
        );
      } else if ('success' in res && res.success === false) {
        // Сервер вернул ошибку, откатываем оптимистичное обновление
        setFavorites(prev => {
          if (action === 'added') {
            return prev.filter(f => f._id !== good._id);
          } else {
            return [...prev, toPlain(good)];
          }
        });

        toast.error(
          res.message || 'Авторизуйтесь щоб додати Товар до улюбленого'
        );
      }
    } catch (err) {
      console.error(err);
      // Откат оптимистичного обновления
      setFavorites(prev => {
        if (action === 'added') {
          return prev.filter(f => f._id !== good._id);
        } else {
          return [...prev, toPlain(good)];
        }
      });

      toast.error('Не вдалося оновити улюблені товари');
    }
  }, []);

  const isFavorite = useCallback(
    (goodId: string) => favorites.some(f => f._id === goodId),
    [favorites]
  );

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite, setFavorites }),
    [favorites, toggleFavorite, isFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
