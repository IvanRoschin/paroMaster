import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getGoodById, updateGood } from '@/actions/goods';
import { GoodForm } from '@/admin/components';
import { IGood } from '@/types/IGood';
import { ISearchParams } from '@/types/index';

export type ParamsType = { id: string };

export default async function SingleGoodPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;

  const [good, categoriesResponse, brandsResponse] = await Promise.all([
    getGoodById(params.id),
    getAllCategories(searchParams),
    getAllBrands(searchParams),
  ]);

  const categories = categoriesResponse.categories ?? [];
  const brands = brandsResponse.brands ?? [];

  return (
    <div className="mb-20">
      <GoodForm
        title="Редагувати дані про товар"
        good={good as IGood}
        allowedCategories={categories}
        allowedBrands={brands}
        action={updateGood}
      />
    </div>
  );
}
