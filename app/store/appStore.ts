import { useCartStore } from './cartStore';
import { useCompareStore } from './compareStore';
import { useFavoritesStore } from './favoritesStore';
import { useFiltersStore } from './filtersStore';
import { useRefreshStore } from './refreshStore';
import { useUserStore } from './userStore';

export const useAppStore = () => ({
  user: useUserStore(),
  cart: useCartStore(),
  favorites: useFavoritesStore(),
  compare: useCompareStore(),
  filters: useFiltersStore(),
  refresh: useRefreshStore(),
});
