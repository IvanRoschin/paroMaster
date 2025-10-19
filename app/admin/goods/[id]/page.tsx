import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getGoodById, updateGood } from '@/actions/goods';
import { GoodForm } from '@/admin/components';
import { IGoodUI } from '@/types/IGood';
import { ISearchParams } from '@/types/index';

export type ParamsType = { id: string };

export default async function SingleGoodPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<ISearchParams>;
}) {
  const { id } = await params;
  const query = await searchParams;

  const [good, categoriesResponse, brandsResponse] = await Promise.all([
    getGoodById(id),
    getAllCategories(query),
    getAllBrands(query),
  ]);

  const categories = categoriesResponse.categories ?? [];
  const brands = brandsResponse.brands ?? [];

  return (
    <div className="mb-20">
      <GoodForm
        title="Редагувати дані про товар"
        good={good as IGoodUI}
        allowedCategories={categories}
        allowedBrands={brands}
        action={updateGood}
      />
    </div>
  );
}
