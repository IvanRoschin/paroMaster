'use client';

import { useState } from 'react';

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/(admin)/components/ui';
import { useAppStore } from '@/app/store/appStore';

export interface Option {
  value: string;
  label: string;
  slug?: string;
}

export interface ProductFiltersState {
  category: string;
  brand: string;
  availability: string;
  condition: string;
  sortPrice: 'asc' | 'desc' | 'none';
  search: string;
}

interface ProductFiltersProps {
  categories: Option[];
  brands: Option[];
  onChange: (filters: ProductFiltersState) => void;
}

export default function ProductFilters({
  categories,
  brands,
  onChange,
}: ProductFiltersProps) {
  const [filter, setFilter] = useState<ProductFiltersState>({
    category: 'all',
    brand: 'all',
    availability: 'all',
    condition: 'all',
    sortPrice: 'none',
    search: '',
  });

  const { filters } = useAppStore();

  // Контекст для синхронизации бренда
  const setSelectedBrands = filters.setSelectedBrands;

  function update<K extends keyof ProductFiltersState>(
    key: K,
    value: ProductFiltersState[K]
  ) {
    const updated = { ...filter, [key]: value };
    setFilter(updated);
    onChange(updated);

    // Синхронизация бренда с контекстом
    if (key === 'brand') {
      const brandOption = brands.find(b => b.value === value);
      setSelectedBrands?.(brandOption ? [brandOption] : []);
    }
  }

  return (
    <div className="flex flex-wrap gap-3 items-center bg-gray-50 p-4 rounded-xl shadow-sm">
      <Input
        placeholder="Пошук за назвою або SKU..."
        value={filter.search}
        onChange={e => update('search', e.target.value)}
        className="w-64"
      />

      {/* Категорії */}
      <Select
        value={filter.category}
        onValueChange={v => update('category', v)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Категорія" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">Всі категорії</SelectItem>
          {categories.map(c => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Бренди */}
      <Select value={filter.brand} onValueChange={v => update('brand', v)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Бренд" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">Всі бренди</SelectItem>
          {brands.map(b => (
            <SelectItem key={b.value} value={b.value}>
              {b.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Наявність */}
      <Select
        value={filter.availability}
        onValueChange={v => update('availability', v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Наявність" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">Всі</SelectItem>
          <SelectItem value="available">Є в наявності</SelectItem>
          <SelectItem value="unavailable">Немає</SelectItem>
        </SelectContent>
      </Select>

      {/* Стан */}
      <Select
        value={filter.condition}
        onValueChange={v => update('condition', v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Стан" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">Всі</SelectItem>
          <SelectItem value="new">Новий</SelectItem>
          <SelectItem value="used">Б/у</SelectItem>
        </SelectContent>
      </Select>

      {/* Сортування */}
      <Select
        value={filter.sortPrice}
        onValueChange={v => update('sortPrice', v as 'asc' | 'desc' | 'none')}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Сортувати за ціною" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="none">Без сортування</SelectItem>
          <SelectItem value="asc">Ціна ↑</SelectItem>
          <SelectItem value="desc">Ціна ↓</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
