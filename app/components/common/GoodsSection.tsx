'use client';

import { useMemo, useState } from 'react';
import { useContextSelector } from 'use-context-selector';

import { getAllBrands } from '@/app/actions/brands';
import { getAllCategories } from '@/app/actions/categories';
import { useFetchData } from '@/app/hooks';
import {
  ButtonAddGood,
  CardView,
  EmptyState,
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
import { UserRole } from '@/types/IUser';
import { ISearchParams } from '@/types/searchParams';

import { ProductFiltersState } from '../ui/ProductFilters';

interface GoodsSectionProps {
  goods: IGoodUI[];
  title?: string;
  searchParams: ISearchParams;
  initialCategory?: string;
  role: UserRole;
}

export default function GoodsSection({
  goods,
  title,
  initialCategory,
  searchParams,
  role,
}: GoodsSectionProps) {
  const { data: categoriesData, isLoading: catLoading } = useFetchData(
    getAllCategories,
    ['categories']
  );
  const { data: brandsData, isLoading: brandLoading } = useFetchData(
    getAllBrands,
    ['brands']
  );

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
      slug: b.slug, // ✅ добавляем slug
      src: b.src || '',
    }));

  const filteredGoods = useMemo(() => {
    return goods
      .filter(g => {
        const matchCategory =
          filters.category === 'all' || g.category?._id === filters.category;

        // Берем первый выбранный бренд из контекста, если есть
        const brandFilter = selectedBrands?.[0]?.value ?? filters.brand;
        const matchBrand =
          brandFilter === 'all' || g.brand?._id === brandFilter;

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
      })
      .sort((a, b) => {
        if (filters.sortPrice === 'asc') return a.price - b.price;
        if (filters.sortPrice === 'desc') return b.price - a.price;
        return 0;
      });
  }, [goods, filters, selectedBrands]);

  if (catLoading || brandLoading) return <Loader />;

  console.log('goods', goods);

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

      {filteredGoods.length === 0 ? (
        <EmptyState showReset goHomeAfterReset />
      ) : (
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
      )}
    </div>
  );
}

// 'use client';

// import { useMemo, useState } from 'react';

// import { getAllBrands } from '@/app/actions/brands';
// import { getAllCategories } from '@/app/actions/categories';
// import ProductFilters, {
//   ProductFiltersState,
// } from '@/app/components/ui/ProductFilters';
// import { useFetchData } from '@/app/hooks';
// import {
//   ButtonAddGood,
//   CardView,
//   EmptyState,
//   ListView,
//   Loader,
//   TableView,
//   Tabs,
//   TabsList,
//   TabsTrigger,
// } from '@/components';
// import { IGoodUI } from '@/types';
// import { UserRole } from '@/types/IUser';
// import { ISearchParams } from '@/types/searchParams';

// interface Option {
//   value: string;
//   label: string;
// }

// interface GoodsSectionProps {
//   goods: IGoodUI[];
//   title?: string;
//   searchParams: ISearchParams;
//   initialCategory?: string;
//   role: UserRole;
// }

// export default function GoodsSection({
//   goods,
//   title,
//   initialCategory,
//   searchParams,
//   role,
// }: GoodsSectionProps) {
//   const { data: categoriesData, isLoading: catLoading } = useFetchData(
//     getAllCategories,
//     ['categories']
//   );

//   const { data: brandsData, isLoading: brandLoading } = useFetchData(
//     getAllBrands,
//     ['brands']
//   );

//   const [view, setView] = useState<'table' | 'card' | 'list'>('card');

//   const [filters, setFilters] = useState<ProductFiltersState>({
//     category: initialCategory ?? 'all',
//     brand: 'all',
//     availability: 'all',
//     condition: 'all',
//     sortPrice: 'none',
//     search: '',
//   });

//   const categoriesResponse = categoriesData?.categories ?? [];
//   const brandsResponse = brandsData?.brands ?? [];

//   const categories = (categoriesResponse ?? [])
//     .filter(c => c._id)
//     .map(c => ({
//       value: String(c._id),
//       label: c.name ?? 'Без назви',
//       slug: c.slug,
//       name: c.name,
//     }));

//   const brands = (brandsResponse ?? [])
//     .filter(b => b._id)
//     .map(b => ({
//       value: String(b._id),
//       label: b.name ?? 'Без назви',
//     }));

//   const filteredGoods = useMemo(() => {
//     let result = [...goods];

//     result = result.filter(g => {
//       const matchCategory =
//         filters.category === 'all' || g.category?._id === filters.category;
//       const matchBrand =
//         filters.brand === 'all' || g.brand?._id === filters.brand;
//       const matchAvailability =
//         filters.availability === 'all' ||
//         (filters.availability === 'available' && g.isAvailable) ||
//         (filters.availability === 'unavailable' && !g.isAvailable);
//       const matchCondition =
//         filters.condition === 'all' ||
//         (filters.condition === 'new' && g.isNew) ||
//         (filters.condition === 'used' && !g.isNew);
//       const matchSearch =
//         !filters.search ||
//         g.title.toLowerCase().includes(filters.search.toLowerCase()) ||
//         g.sku?.toLowerCase().includes(filters.search.toLowerCase());

//       return (
//         matchCategory &&
//         matchBrand &&
//         matchAvailability &&
//         matchCondition &&
//         matchSearch
//       );
//     });

//     if (filters.sortPrice !== 'none') {
//       result.sort((a, b) =>
//         filters.sortPrice === 'asc' ? a.price - b.price : b.price - a.price
//       );
//     }

//     return result;
//   }, [goods, filters]);

//   if (catLoading || brandLoading) {
//     return <Loader />;
//   }

//   return (
//     <div className="space-y-6">
//       {title && <h2 className="subtitle-main">{title}</h2>}
//       {/* 🔹 Верхняя панель с табами */}
//       <div className="flex justify-between items-center my-4">
//         {role === UserRole.ADMIN && <ButtonAddGood role={role} />}
//         <span> </span>{' '}
//         <Tabs
//           value={view}
//           onValueChange={val => setView(val as 'table' | 'card' | 'list')}
//         >
//           <TabsList>
//             <TabsTrigger value="table">Таблиця</TabsTrigger>
//             <TabsTrigger value="card">Картки</TabsTrigger>
//             <TabsTrigger value="list">Список</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       {/* 🔹 Фильтры */}
//       <ProductFilters
//         categories={categories ?? []}
//         brands={brands ?? []}
//         onChange={setFilters}
//       />
//       {filteredGoods.length === 0 ? (
//         <EmptyState showReset goHomeAfterReset />
//       ) : (
//         <>
//           {view === 'card' && (
//             <CardView
//               goods={filteredGoods}
//               role={role}
//               searchParams={searchParams}
//             />
//           )}
//           {view === 'table' && (
//             <TableView
//               goods={filteredGoods}
//               role={role}
//               searchParams={searchParams}
//             />
//           )}
//           {view === 'list' && (
//             <ListView
//               goods={filteredGoods}
//               role={role}
//               searchParams={searchParams}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// }
