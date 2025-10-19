'use client';

import { useMemo, useState } from 'react';

import { EmptyState, ProductCard } from '@/components/index';
import ProductFilters, {
  ProductFiltersState,
} from '@/components/ui/ProductFilters';
import { IGoodUI } from '@/types/index';

interface Option {
  value: string;
  label: string;
}

interface ProductListProps {
  goods: IGoodUI[];
  title?: string;
  categories?: Option[];
  brands?: Option[];
}

export default function ProductList({
  goods,
  title,
  categories = [],
  brands = [],
}: ProductListProps) {
  const [filters, setFilters] = useState<ProductFiltersState>({
    category: 'all',
    brand: 'all',
    availability: 'all',
    condition: 'all',
    sortPrice: 'none',
    search: '',
  });

  const filteredGoods = useMemo(() => {
    let result = [...goods];

    result = result.filter(g => {
      const matchCategory =
        filters.category === 'all' || g.category?._id === filters.category;
      const matchBrand =
        filters.brand === 'all' || g.brand?._id === filters.brand;
      const matchAvailability =
        filters.availability === 'all' ||
        (filters.availability === 'available' && g.isAvailable) ||
        (filters.availability === 'unavailable' && !g.isAvailable);
      const matchCondition =
        filters.condition === 'all' ||
        (filters.condition === 'new' && g.isNew) ||
        (filters.condition === 'used' && !g.isNew);
      const matchSearch =
        !filters.search ||
        g.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        g.sku?.toLowerCase().includes(filters.search.toLowerCase());

      return (
        matchCategory &&
        matchBrand &&
        matchAvailability &&
        matchCondition &&
        matchSearch
      );
    });

    if (filters.sortPrice !== 'none') {
      result.sort((a, b) =>
        filters.sortPrice === 'asc' ? a.price - b.price : b.price - a.price
      );
    }

    return result;
  }, [goods, filters]);

  return (
    <div className="space-y-6">
      {title && <h2 className="subtitle-main">{title}</h2>}

      <ProductFilters
        categories={categories}
        brands={brands}
        onChange={setFilters}
      />

      {filteredGoods.length === 0 ? (
        <EmptyState showReset />
      ) : (
        <ul className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mb-20">
          {filteredGoods.map((good, i) => (
            <ProductCard key={i} good={good} />
          ))}
        </ul>
      )}
    </div>
  );
}
