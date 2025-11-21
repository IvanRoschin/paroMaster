'use client';

import { useMemo, useState } from 'react';
import { useContextSelector } from 'use-context-selector';

import { getAllBrandsAction } from '@/app/actions/brands';
import { getAllCategoriesAction } from '@/app/actions/categories';
import { useFetchData } from '@/app/hooks';
import {
  ButtonAddGood,
  CardView,
  ListView,
  Loader,
  ProductFilters,
  TableView,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components';
import { FiltersContext } from '@/context/FiltersContext';
import { IGoodUI } from '@/types';
import { GetAllBrandsResponse } from '@/types/IBrand';
import { GetAllCategoriesResponse } from '@/types/ICategory';
import { UserRole } from '@/types/IUser';
import { ISearchParams } from '@/types/searchParams';

import { ProductFiltersState } from '../ui/ProductFilters';

interface GoodsSectionProps {
  goods: IGoodUI[];
  title?: string;
  searchParams: ISearchParams;
  initialCategory?: string;
  role: UserRole;
  isLoading?: boolean;
  firstLoadDone?: boolean;
}

export default function GoodsSection({
  goods,
  title,
  initialCategory,
  searchParams,
  role,
  isLoading,
  firstLoadDone,
}: GoodsSectionProps) {
  const { data: categoriesData, isLoading: catLoading } =
    useFetchData<GetAllCategoriesResponse>(getAllCategoriesAction, [
      'categories',
    ]);
  const { data: brandsData, isLoading: brandLoading } =
    useFetchData<GetAllBrandsResponse>(getAllBrandsAction, ['brands']);

  const [view, setView] = useState<'table' | 'card' | 'list'>('card');

  // Контекст для синхронизации брендов
  const selectedBrands = useContextSelector(
    FiltersContext,
    c => c?.selectedBrands
  );

  const [filters, setFilters] = useState<ProductFiltersState>({
    category: initialCategory ?? 'all',
    brand: 'all',
    availability: 'all',
    condition: 'all',
    sortPrice: 'none',
    search: '',
  });

  const categories = (categoriesData?.categories ?? [])
    .filter(c => c._id)
    .map(c => ({
      value: String(c._id),
      label: c.name ?? 'Без назви',
      slug: c.slug,
      name: c.name,
    }));

  const brands = (brandsData?.brands ?? [])
    .filter(b => b._id)
    .map(b => ({
      value: String(b._id),
      label: b.name ?? 'Без назви',
      slug: b.slug,
      src: b.src || '',
    }));

  const filteredGoods = useMemo(() => {
    const selectedBrandIds = selectedBrands?.map(b => b.value) || [];

    return goods
      .filter(g => {
        const matchCategory =
          filters.category === 'all' || g.category?._id === filters.category;

        // Берем первый выбранный бренд из контекста, если есть
        const matchBrand =
          selectedBrandIds.length === 0 ||
          (g.brand?._id
            ? selectedBrandIds.includes(g.brand._id.toString())
            : false);

        const matchAvailability =
          filters.availability === 'all' ||
          (filters.availability === 'available' && g.isAvailable) ||
          (filters.availability === 'unavailable' && !g.isAvailable);

        const matchCondition =
          filters.condition === 'all' ||
          (filters.condition === 'new' && !g.isUsed) ||
          (filters.condition === 'used' && g.isUsed);

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
      })
      .sort((a, b) => {
        if (filters.sortPrice === 'asc') return a.price - b.price;
        if (filters.sortPrice === 'desc') return b.price - a.price;
        return 0;
      });
  }, [goods, filters, selectedBrands]);

  if (catLoading || brandLoading) return <Loader />;

  return (
    <div className="space-y-6">
      {title && <h2 className="subtitle-main">{title}</h2>}

      {/* Верхняя панель */}
      <div className="flex justify-between items-center my-4">
        {role === UserRole.ADMIN && <ButtonAddGood role={role} />}
        <Tabs
          value={view}
          onValueChange={val => setView(val as 'table' | 'card' | 'list')}
        >
          <TabsList>
            <TabsTrigger value="table">Таблиця</TabsTrigger>
            <TabsTrigger value="card">Картки</TabsTrigger>
            <TabsTrigger value="list">Список</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Фильтры */}
      <ProductFilters
        categories={categories}
        brands={brands}
        onChange={setFilters}
      />

      <>
        {view === 'card' && (
          <CardView
            goods={filteredGoods}
            role={role}
            searchParams={searchParams}
          />
        )}
        {view === 'table' && (
          <TableView
            goods={filteredGoods}
            role={role}
            searchParams={searchParams}
          />
        )}
        {view === 'list' && (
          <ListView
            goods={filteredGoods}
            role={role}
            searchParams={searchParams}
          />
        )}
      </>
    </div>
  );
}
