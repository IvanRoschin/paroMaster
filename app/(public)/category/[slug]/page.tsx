import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getServerSession } from 'next-auth';

import { getAllCategories, getCategoryBySlug } from '@/app/actions/categories';
import { getGoodsByCategory } from '@/app/actions/goods';
import { EmptyState } from '@/app/components';
import { authOptions } from '@/app/config/authOptions';
import prefetchData from '@/app/hooks/usePrefetchData';
import { UserRole } from '@/types/IUser';
import { ISearchParams } from '@/types/searchParams';
import CategoryClient from './CategoryClient';

export type ParamsType = Promise<{ slug: string }>;

interface CategoryPageProps {
  params: ParamsType;
  searchParams: Promise<ISearchParams>;
}

// ✅ Мета-теги (динамические)
export async function generateMetadata({ searchParams }: CategoryPageProps) {
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
    title: `Купити ${categoryName} | Назва магазину`,
    description: `Категорія ${categoryName}. Оберіть найкращі товари за вигідною ціною.`,
  };
}

// ✅ Основная страница категории
export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const search = await searchParams;

  // 1️⃣ Категория по slug
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return (
      <EmptyState
        showReset
        title="Категорію не знайдено"
        actionHref="/catalog"
      />
    );
  }

  // 2️⃣ Префетч товаров
  const queryClient = new QueryClient();
  await prefetchData(queryClient, getGoodsByCategory, ['goods', slug], slug);

  const goodsData = queryClient.getQueryData(['goods', slug]) as any;
  const goods = goodsData ?? [];

  // 4️⃣ Роль пользователя
  const session = await getServerSession(authOptions);
  const role = session?.user?.role
    ? (session.user.role as UserRole)
    : UserRole.GUEST;

  // 5️⃣ Если нет товаров
  if (!goods || goods.length === 0) {
    return (
      <EmptyState
        showReset
        title={`Відсутні товари у категорії "${category.name}"`}
        goHomeAfterReset
      />
    );
  }

  // 6️⃣ Рендер страницы
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryClient
        category={category}
        goods={goods}
        search={search}
        role={role}
      />
    </HydrationBoundary>
  );
}
