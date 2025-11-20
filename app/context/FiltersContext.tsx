'use client';

import { ReactNode, useMemo, useState } from 'react';
import { createContext } from 'use-context-selector';

export interface Option {
  value: string;
  label: string;
  slug?: string;
  src?: string;
}

interface FiltersContextType {
  minPrice: number | null;
  maxPrice: number | null;
  setMinPrice: (value: number | null) => void;
  setMaxPrice: (value: number | null) => void;

  selectedBrands: Option[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<Option[]>>;

  selectedCategory: string;
  setCategory: (slug: string) => void;

  sort: 'asc' | 'desc' | '';
  setSort: (sort: 'asc' | 'desc' | '') => void;
}

export const FiltersContext = createContext<FiltersContextType | null>(null);

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<Option[]>([]);
  const [selectedCategory, setCategory] = useState<string>('');
  const [sort, setSort] = useState<'asc' | 'desc' | ''>('');

  const value = useMemo(
    () => ({
      minPrice,
      maxPrice,
      setMinPrice,
      setMaxPrice,
      selectedBrands,
      setSelectedBrands,
      selectedCategory,
      setCategory,
      sort,
      setSort,
    }),
    [minPrice, maxPrice, selectedBrands, selectedCategory, sort]
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};
