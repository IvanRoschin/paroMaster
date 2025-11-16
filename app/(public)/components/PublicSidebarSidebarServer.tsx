import { getAllBrandsAction } from '@/actions/brands';
import { getAllCategoriesAction } from '@/actions/categories';
import { getMinMaxPriceAction } from '@/actions/goods';
import { ISearchParams } from '@/types/index';

import PublicSidebar from './PublicSidebar';

interface SidebarServerProps {
  searchParams?: ISearchParams;
}

export default async function PublicSidebarServer({
  searchParams,
}: SidebarServerProps) {
  const [pricesData, categoriesResponse, brandsResponse] = await Promise.all([
    getMinMaxPriceAction(),
    getAllCategoriesAction(searchParams ?? {}),
    getAllBrandsAction(searchParams ?? {}),
  ]);

  return (
    <PublicSidebar
      pricesData={pricesData}
      categories={categoriesResponse.categories}
      brands={brandsResponse.brands}
    />
  );
}
