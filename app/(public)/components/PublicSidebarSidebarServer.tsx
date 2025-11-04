import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getMinMaxPrice } from '@/actions/goods';
import { ISearchParams } from '@/types/index';
import PublicSidebar from './PublicSidebar';

interface SidebarServerProps {
  searchParams?: ISearchParams;
}

export default async function PublicSidebarServer({
  searchParams,
}: SidebarServerProps) {
  const [pricesData, categoriesResponse, brandsResponse] = await Promise.all([
    getMinMaxPrice(),
    getAllCategories(searchParams ?? {}),
    getAllBrands(searchParams ?? {}),
  ]);

  return (
    <PublicSidebar
      pricesData={pricesData}
      categories={categoriesResponse.categories}
      brands={brandsResponse.brands}
    />
  );
}
