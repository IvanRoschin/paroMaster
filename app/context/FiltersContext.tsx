'use client';

import { ReactNode, useState } from 'react';
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
  setSelectedBrands: (brands: Option[]) => void;

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

  const value: FiltersContextType = {
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
  };

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};
