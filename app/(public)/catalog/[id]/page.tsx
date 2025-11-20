import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

import { getGoodByIdAction } from '@/actions/goods';
import { getGoodTestimonialsAction } from '@/actions/testimonials';
import { authOptions } from '@/app/config/authOptions';
import prefetchData from '@/hooks/usePrefetchData';
import { UserRole } from '@/types/IUser';
import GoodPageClient from './GoodPageClient';

// app/good/[id]/page.tsx

export type paramsType = Promise<{ id: string }>;

// ------------------- generateMetadata -------------------
export async function generateMetadata(props: { params: paramsType }) {
  const { id } = await props.params;

  const good = await getGoodByIdAction(id);

  if (!good) {
    return {
      title: 'Товар не знайдено | ParoMaster',
      description: 'Цей товар більше не доступний.',
    };
  }

  const brandName = good.brand?.name || '';
  const categoryName = good.category?.name || '';
  const modelName = good.model || '';
  const keywords = [brandName, categoryName, modelName, 'ParoMaster'].filter(
    Boolean
  );

  return {
    title: good.title,
    description: good.description || 'Деталі про товар.',
    keywords: keywords.join(', '),
    openGraph: {
      title: good.title,
      description: good.description,
      images: good.src?.map((img: string) => ({ url: img })) || [],
    },
  };
}

// ------------------- Page Component -------------------
export default async function GoodPage(props: { params: paramsType }) {
  const { id } = await props.params;

  const good = await getGoodByIdAction(id);
  if (!good) notFound();

  const session = await getServerSession(authOptions);
  const role = session?.user?.role
    ? (session.user.role as UserRole)
    : UserRole.GUEST;

  const queryClient = new QueryClient();
  await prefetchData(
    queryClient,
    getGoodTestimonialsAction,
    ['testimonials', good._id],
    good._id
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GoodPageClient good={good} role={role} />
    </HydrationBoundary>
  );
}
