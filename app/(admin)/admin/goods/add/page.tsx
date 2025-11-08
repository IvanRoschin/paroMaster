// app/(admin)/goods/add/page.tsx

import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { addGood } from '@/actions/goods';
import { GoodForm } from '@/app/(admin)/components';

export default async function AddGoodPage() {
  const [categoriesResponse, brandsResponse] = await Promise.all([
    getAllCategories(),
    getAllBrands(),
  ]);

  const categories = categoriesResponse.categories ?? [];
  const brands = brandsResponse.brands ?? [];

  return (
    <>
      <div className="max-w-6xl mx-auto py-3 container mb-20">
        <h2 className="subtitle text-center">🛍️ Додати новий товар</h2>
        <GoodForm
          title=""
          action={addGood}
          allowedCategories={categories}
          allowedBrands={brands}
        />
      </div>
    </>
  );
}
