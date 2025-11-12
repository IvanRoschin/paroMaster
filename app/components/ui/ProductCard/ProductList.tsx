// 'use client';

// import { useMemo, useState } from 'react';

// import {
//   CardView,
//   EmptyState,
//   ListView,
//   TableView,
//   Tabs,
//   TabsList,
//   TabsTrigger,
// } from '@/components';
// import ProductFilters, {
//   ProductFiltersState,
// } from '@/components/ui/ProductFilters';
// import { IGoodUI, ISearchParams } from '@/types/index';
// import { UserRole } from '@/types/IUser';

// interface Option {
//   value: string;
//   label: string;
// }

// interface ProductListProps {
//   goods: IGoodUI[];
//   title?: string;
//   searchParams: ISearchParams;
//   categories?: Option[];
//   brands?: Option[];
//   initialCategory?: string;
//   role: UserRole;
// }

// export default function ProductList({
//   goods,
//   title,
//   initialCategory,
//   categories = [],
//   brands = [],
//   role,
// }: ProductListProps) {
//   const [view, setView] = useState<'table' | 'card' | 'list'>('table');
//   const [filters, setFilters] = useState<ProductFiltersState>({
//     category: initialCategory ?? 'all',
//     brand: 'all',
//     availability: 'all',
//     condition: 'all',
//     sortPrice: 'none',
//     search: '',
//   });

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

//   return (
//     <div className="space-y-6">
//       {title && <h2 className="subtitle-main">{title}</h2>}
//       <div className="flex justify-between items-center my-4">
//         <span></span>{' '}
//         <Tabs
//           value={view}
//           onValueChange={val => setView(val as 'table' | 'card' | 'list')}
//         >
//           <TabsList>
//             <TabsTrigger value="table">Таблиця</TabsTrigger>
//             <TabsTrigger value="list">Список</TabsTrigger>
//             <TabsTrigger value="card">Картки</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>
//       <ProductFilters
//         categories={categories}
//         brands={brands}
//         onChange={setFilters}
//       />

//       {filteredGoods.length === 0 ? (
//         <EmptyState showReset />
//       ) : (
//         <>
//           {view === 'table' && (
//             <TableView
//               goods={filteredGoods}
//               role={role}
//               searchParams={searchParams}
//             />
//           )}
//           {view === 'list' && <ListView goods={filteredGoods} role={role} />}
//           {view === 'card' && <CardView goods={filteredGoods} role={role} />}
//         </>
//       )}
//     </div>
//   );
// }
