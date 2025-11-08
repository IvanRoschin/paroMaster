// app/(admin)/goods/add/page.tsx

import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { addGood, getGoodsByBrand } from '@/actions/goods';
import { GoodForm } from '@/app/(admin)/components';
import { IGoodUI } from '@/types/index';

export default async function AddGoodPage() {
  const [categoriesResponse, brandsResponse] = await Promise.all([
    getAllCategories(),
    getAllBrands(),
  ]);

  const categories = categoriesResponse.categories ?? [];
  const brands = brandsResponse.brands ?? [];

  const defaultBrandId = brands[0]?._id;
  let goodsByBrand: IGoodUI[] = [];

  if (defaultBrandId) {
    goodsByBrand = (await getGoodsByBrand(
      defaultBrandId
    )) as unknown as IGoodUI[];
  }

  return (
    <>
      <div className="max-w-6xl mx-auto py-3 container mb-20">
        <h2 className="subtitle text-center">🛍️ Додати новий товар</h2>
        <GoodForm
          title=""
          action={addGood}
          allowedCategories={categories}
          allowedBrands={brands}
          goodsByBrand={goodsByBrand}
        />
      </div>
    </>
  );
}
