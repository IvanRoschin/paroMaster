import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getGoodById, updateGood } from '@/actions/goods';
import { GoodForm } from '@/admin/components';
import { IGood } from '@/types/IGood';

export type ParamsType = { id: string };

interface SingleGoodPageProps {
  params: ParamsType;
}

export default async function SingleGoodPage({ params }: SingleGoodPageProps) {
  const { id } = params;

  const [good, categoriesResponse, brandsResponse] = await Promise.all([
    getGoodById(id),
    getAllCategories(params),
    getAllBrands(params),
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
