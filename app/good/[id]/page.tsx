import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { getGoodById } from '@/actions/goods';
import { getGoodTestimonials } from '@/actions/testimonials';
import { getReadableGoodTitle } from '@/helpers/index';
import prefetchData from '@/hooks/usePrefetchData';
import GoodPageClient from './GoodPageClient';

// app/good/[id]/page.tsx

export type paramsType = Promise<{ id: string }>;

// ------------------- generateMetadata -------------------
export async function generateMetadata(props: { params: paramsType }) {
  const { id } = await props.params;

  const good = await getGoodById(id);

  if (!good) {
    return {
      title: 'Товар не знайдено | ParoMaster',
      description: 'Цей товар більше не доступний.',
    };
  }

  const title = getReadableGoodTitle(good);

  return {
    title,
    description: good.description || 'Деталі про товар.',
    openGraph: {
      title,
      description: good.description,
      images: good.images?.map((img: string) => ({ url: img })) || [],
    },
  };
}

// ------------------- Page Component -------------------
export default async function GoodPage(props: { params: paramsType }) {
  const { id } = await props.params;

  const good = await getGoodById(id);
  if (!good) notFound();

  console.log('good', good);

  // react-query prefetch
  const queryClient = new QueryClient();
  await prefetchData(
    queryClient,
    getGoodTestimonials,
    ['testimonials', good.id],
    good.id
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GoodPageClient initialGood={good} />
    </HydrationBoundary>
  );
}
