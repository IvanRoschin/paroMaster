import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getMinMaxPrice } from '@/actions/goods';
// app/components/sections/SidebarServer.tsx
import { ISearchParams } from '@/types/index';

import Sidebar from './Sidebar';

interface SidebarServerProps {
  searchParams?: ISearchParams;
}

export default async function SidebarServer({
  searchParams,
}: SidebarServerProps) {
  const [pricesData, categoriesResponse, brandsResponse] = await Promise.all([
    getMinMaxPrice(),
    getAllCategories(searchParams ?? {}),
    getAllBrands(searchParams ?? {}),
  ]);

  console.log('pricesData:', pricesData);

  return (
    <Sidebar
      pricesData={pricesData}
      categories={categoriesResponse.categories}
      brands={brandsResponse.brands}
    />
  );
}
