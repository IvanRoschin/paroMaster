// stores/filtersStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { storageKeys } from '../helpers';

export interface Option {
  value: string;
  label: string;
  slug?: string;
  src?: string;
}

export interface FiltersState {
  minPrice: number | null;
  maxPrice: number | null;
  selectedBrands: Option[];
  selectedCategory: string;
  sort: 'asc' | 'desc' | '';
  setMinPrice: (value: number | null) => void;
  setMaxPrice: (value: number | null) => void;
  setSelectedBrands: (value: Option[]) => void;
  setCategory: (slug: string) => void;
  setSort: (sort: 'asc' | 'desc' | '') => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    set => ({
      minPrice: null,
      maxPrice: null,
      selectedBrands: [],
      selectedCategory: '',
      sort: '',
      setMinPrice: value => set(state => ({ ...state, minPrice: value })),
      setMaxPrice: value => set(state => ({ ...state, maxPrice: value })),
      setSelectedBrands: value =>
        set(state => ({ ...state, selectedBrands: value })),
      setCategory: slug => set(state => ({ ...state, selectedCategory: slug })),
      setSort: sort => set(state => ({ ...state, sort })),
      resetFilters: () =>
        set(state => ({
          ...state,
          minPrice: null,
          maxPrice: null,
          selectedBrands: [],
          selectedCategory: '',
          sort: '',
        })),
    }),
    { name: storageKeys.filters }
  )
);
