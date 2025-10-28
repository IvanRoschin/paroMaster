import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getGoodById, getGoodsByBrand, updateGood } from '@/actions/goods';
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

  const goodNotNull = good;
  if (!goodNotNull) {
    return <p>Товар не знайдено</p>; // или редирект / 404
  }

  const brandId: string | undefined =
    goodNotNull.brand && typeof goodNotNull.brand === 'object'
      ? goodNotNull.brand._id
      : typeof goodNotNull.brand === 'string'
        ? goodNotNull.brand
        : undefined;

  let goodsByBrand: IGoodUI[] = [];
  if (brandId) {
    const rawGoods = await getGoodsByBrand(brandId, goodNotNull._id);
    goodsByBrand = rawGoods as unknown as IGoodUI[];
  }

  return (
    <div className="mb-20">
      <GoodForm
        title="Редагувати дані про товар"
        good={good as IGoodUI}
        goodsByBrand={goodsByBrand as IGoodUI[]}
        allowedCategories={categories}
        allowedBrands={brands}
        action={updateGood}
      />
    </div>
  );
}
