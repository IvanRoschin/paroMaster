import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { toggleFavoriteAction } from '@/actions/customers';
import toPlain from '@/helpers/server/toPlain';
import { IGoodUI } from '@/types/IGood';
import { storageKeys } from '../helpers';

// stores/favoritesStore.ts

export interface FavoritesState {
  favorites: IGoodUI[];
  toggleFavorite: (good: IGoodUI) => Promise<void>;
  isFavorite: (id: string) => boolean;
  setFavorites: (value: IGoodUI[]) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      setFavorites: value => set({ favorites: value }),

      isFavorite: id => get().favorites.some(f => f._id === id),

      toggleFavorite: async good => {
        let action: 'added' | 'removed' = 'added';
        const exists = get().favorites.find(f => f._id === good._id);

        set({
          favorites: exists
            ? ((action = 'removed'),
              get().favorites.filter(f => f._id !== good._id))
            : [...get().favorites, toPlain(good)],
        });

        toast[action === 'added' ? 'success' : 'info'](
          action === 'added'
            ? `Товар "${good.title}" додано в улюблені`
            : 'Товар видалено з улюблених'
        );

        try {
          const res = await toggleFavoriteAction(good._id);
          if (res.favorites?.length) {
            set(state => ({
              favorites: state.favorites.filter(f =>
                res.favorites!.includes(f._id)
              ),
            }));
          } else if ('success' in res && res.success === false) {
            set({
              favorites:
                action === 'added'
                  ? get().favorites.filter(f => f._id !== good._id)
                  : [...get().favorites, toPlain(good)],
            });
            toast.error(
              res.message || 'Авторизуйтесь щоб додати Товар до улюбленого'
            );
          }
        } catch {
          set({
            favorites:
              action === 'added'
                ? get().favorites.filter(f => f._id !== good._id)
                : [...get().favorites, toPlain(good)],
          });
          toast.error('Не вдалося оновити улюблені товари');
        }
      },
    }),
    {
      name: storageKeys.favorites,
      partialize: state => ({ favorites: state.favorites }),
    }
  )
);
