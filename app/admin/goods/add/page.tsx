import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { addGood } from '@/actions/goods';
import { GoodForm } from '@/admin/components';
import { ISearchParams } from '@/types/searchParams';

export default async function AddGoodPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;

  const [categoriesResponse, brandsResponse] = await Promise.all([
    getAllCategories(params),
    getAllBrands(params),
  ]);

  const categories = categoriesResponse.categories ?? [];
  const brands = brandsResponse.brands ?? [];

  return (
    <div className="mb-20">
      <GoodForm
        title="Додати новий товар"
        action={addGood}
        allowedCategories={categories}
        allowedBrands={brands}
      />
    </div>
  );
}
