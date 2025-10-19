'use client';

import { useState } from 'react';

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/admin/components/ui';

interface Option {
  value: string;
  label: string;
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
  const [filters, setFilters] = useState<ProductFiltersState>({
    category: 'all',
    brand: 'all',
    availability: 'all',
    condition: 'all',
    sortPrice: 'none',
    search: '',
  });

  function update<K extends keyof ProductFiltersState>(
    key: K,
    value: ProductFiltersState[K]
  ) {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onChange(updated);
  }

  return (
    <div className="flex flex-wrap gap-3 items-center bg-gray-50 p-4 rounded-xl shadow-sm">
      <Input
        placeholder="Пошук за назвою або SKU..."
        value={filters.search}
        onChange={e => update('search', e.target.value)}
        className="w-64"
      />

      {/* Категорії */}
      <Select
        value={filters.category}
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
      <Select value={filters.brand} onValueChange={v => update('brand', v)}>
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
        value={filters.availability}
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
        value={filters.condition}
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
        value={filters.sortPrice}
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
