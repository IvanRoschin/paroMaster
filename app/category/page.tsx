import { Suspense } from 'react';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getAllGoods } from '@/actions/goods';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { IGoodUI } from '@/types/index';
import { ISearchParams } from '@/types/searchParams';
import { EmptyState, ProductList, ProductListSkeleton } from '../components';

interface GoodsData {
  goods: IGoodUI[];
}

export const dynamic = 'force-dynamic';

// ✅ Правильная типизация generateMetadata
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;

  const categoriesResponse = await getAllCategories(params);
  const categories = (categoriesResponse.categories ?? []).map(c => ({
    value: String(c._id),
    label: c.name ?? 'Без назви',
    slug: c.slug,
    name: c.name,
  }));

  const currentCategory = categories.find(
    c => c.slug === params.category || c.value === params.category
  );

  const categoryName = currentCategory?.name ?? 'Категорія';

  return {
    title: `Купити ${params.category} — ${categoryName} | Назва магазину`,
    description: `Категорія ${categoryName}. Оберіть найкращі товари за вигідною ціною.`,
  };
}

// ✅ Главная страница
export default async function CategoryPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  // 👇 обязательно await — в Next.js 15 searchParams это Promise
  const params = await searchParams;

  const queryClient = new QueryClient();
  const goodsKey = ['goods', params];

  await queryClient.prefetchQuery({
    queryKey: goodsKey,
    queryFn: () => getAllGoods(params),
  });

  const queryState = queryClient.getQueryState(goodsKey);
  const goods = (queryState?.data as GoodsData)?.goods || [];

  const [categoriesResponse, brandsResponse] = await Promise.all([
    getAllCategories(params),
    getAllBrands(params),
  ]);

  const categories = (categoriesResponse.categories ?? [])
    .filter(c => c._id)
    .map(c => ({
      value: String(c._id),
      label: c.name ?? 'Без назви',
      slug: c.slug,
      name: c.name,
    }));

  const brands = (brandsResponse.brands ?? [])
    .filter(b => b._id)
    .map(b => ({
      value: String(b._id),
      label: b.name ?? 'Без назви',
    }));

  const currentCategory = categories.find(
    c => c.slug === params.category || c.value === params.category
  );

  const categoryName = currentCategory?.name ?? 'Категорія';

  if (!goods || goods.length === 0) {
    return (
      <EmptyState
        showReset
        title={`Відсутні товари у вибраній категорії ${categoryName}`}
        actionHref="/catalog"
      />
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-6xl mx-auto px-4 pt-3 container">
        <Breadcrumbs />
        <h2 className="subtitle mb-3 text-center">
          {categoryName}{' '}
          <span className="text-sm text-gray-500">({goods.length})</span>
        </h2>
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList
            key={params.category}
            goods={goods}
            categories={categories}
            brands={brands}
            initialCategory={currentCategory?.value}
          />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
