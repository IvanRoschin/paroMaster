export interface Option {
  value: string;
  label: string;
  slug?: string;
  src?: string;
}

export interface FiltersState {
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
