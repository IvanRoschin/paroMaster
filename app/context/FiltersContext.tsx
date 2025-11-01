'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

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

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<Option[]>([]);
  const [selectedCategory, setCategory] = useState<string>('');
  const [sort, setSort] = useState<'asc' | 'desc' | ''>('');

  return (
    <FiltersContext.Provider
      value={{
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
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FiltersContext);
  if (!context)
    throw new Error('useFilter must be used within FiltersProvider');
  return context;
};
