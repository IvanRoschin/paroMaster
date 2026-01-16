import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { toggleFavoriteAction } from '@/actions/customers';
import { IGoodUI } from '@/types/IGood';
import { storageKeys } from '../helpers';
import { serializeForClient } from '../helpers/server/serializeForClient';

export interface FavoritesState {
  favorites: IGoodUI[];
  userRole: 'guest' | 'customer' | 'admin';
  setUserRole: (role: 'guest' | 'customer' | 'admin') => void;

  toggleFavorite: (good: IGoodUI) => Promise<void>;
  isFavorite: (id: string) => boolean;
  setFavorites: (value: IGoodUI[]) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      userRole: 'guest',
      setUserRole: role => set({ userRole: role }),

      setFavorites: value => set({ favorites: value }),
      clearFavorites: () => set({ favorites: [] }),

      isFavorite: id => get().favorites.some(f => f._id === id),

      toggleFavorite: async good => {
        const { userRole, favorites } = get();

        // ❗ запрет на избранное для гостя
        if (userRole === 'guest') {
          toast.error('Авторизуйтесь, щоб додати товар в улюблені');
          return;
        }

        let action: 'added' | 'removed' = 'added';
        const exists = favorites.find(f => f._id === good._id);

        set({
          favorites: exists
            ? ((action = 'removed'), favorites.filter(f => f._id !== good._id))
            : [...favorites, serializeForClient(good)],
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
          } else if (res.success === false) {
            set({
              favorites:
                action === 'added'
                  ? get().favorites.filter(f => f._id !== good._id)
                  : [...get().favorites, serializeForClient(good)],
            });
            toast.error(res.message);
          }
        } catch {
          set({
            favorites:
              action === 'added'
                ? get().favorites.filter(f => f._id !== good._id)
                : [...get().favorites, serializeForClient(good)],
          });
          toast.error('Не вдалося оновити улюблені товари');
        }
      },
    }),
    {
      name: storageKeys.favorites,
      partialize: state => ({
        favorites: state.favorites,
        userRole: state.userRole,
      }),
    }
  )
);
