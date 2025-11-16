// app/(admin)/goods/add/page.tsx

import { getAllBrandsAction } from '@/actions/brands';
import { getAllCategoriesAction } from '@/actions/categories';
import { addGoodAction, getGoodsByBrandAction } from '@/actions/goods';
import { GoodForm } from '@/app/(admin)/components';
import { IGoodUI } from '@/types/index';

export default async function AddGoodPage() {
  const [categoriesResponse, brandsResponse] = await Promise.all([
    getAllCategoriesAction(),
    getAllBrandsAction(),
  ]);

  const categories = categoriesResponse.categories ?? [];
  const brands = brandsResponse.brands ?? [];

  const defaultBrandId = brands[0]?._id;
  let goodsByBrand: IGoodUI[] = [];

  if (defaultBrandId) {
    goodsByBrand = (await getGoodsByBrandAction(
      defaultBrandId
    )) as unknown as IGoodUI[];
  }

  return (
    <>
      <div className="max-w-6xl mx-auto py-3 container mb-20">
        <h2 className="subtitle text-center">🛍️ Додати новий товар</h2>
        <GoodForm
          title=""
          action={addGoodAction}
          allowedCategories={categories}
          allowedBrands={brands}
          goodsByBrand={goodsByBrand}
        />
      </div>
    </>
  );
}
