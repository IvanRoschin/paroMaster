import { getServerSession } from 'next-auth';

import { IGoodUI, ISearchParams } from '@/types/index';
import { IGetAllSlides } from '@/types/ISlider';
import { IGetAllTestimonials, ITestimonial } from '@/types/ITestimonial';
import { UserRole } from '@/types/IUser';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getAllGoodsAction } from './actions/goods';
import { getAllSlidesAction } from './actions/slides';
import { getAllTestimonialsAction } from './actions/testimonials';
import { Advantages, ShoppingCart } from './components';
import DailyDealsSection from './components/sections/DailyDealsSection';
import BannerSlider from './components/sections/Sliders/BannerSlider';
import TestimonialSlider from './components/sections/Sliders/TestimonialSlider';
import { authOptions } from './config/authOptions';
import { generateMetadata } from './helpers/generateMetadata';

export const metadata = generateMetadata({
  title: 'Головна | ParoMaster',
  description: 'Головна сторінка ParoMaster – продаж і ремонт парогенераторів.',
  url: process.env.PUBLIC_URL,
  imageUrl: '/services/01.webp',
});

// Константы для ключей React Query
const GOODS_QUERY_KEY = (limit: number) => ['goods', { limit }];
const SLIDES_QUERY_KEY = (params: ISearchParams) => [
  'slides',
  JSON.stringify(params),
];
const TESTIMONIALS_QUERY_KEY = (params: ISearchParams) => [
  'testimonials',
  JSON.stringify(params),
];

interface GoodsData {
  goods: IGoodUI[];
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;
  const queryClient = new QueryClient();
  const dehydrated = dehydrate(queryClient);
  const safeState = JSON.parse(JSON.stringify(dehydrated));
  const session = await getServerSession(authOptions);
  const role = session?.user?.role as UserRole;
  // Prefetch данных с обработкой ошибок
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: SLIDES_QUERY_KEY(params),
      queryFn: () => getAllSlidesAction(params),
    }),
    queryClient.prefetchQuery({
      queryKey: TESTIMONIALS_QUERY_KEY(params),
      queryFn: () => getAllTestimonialsAction(params),
    }),
    queryClient.prefetchQuery({
      queryKey: GOODS_QUERY_KEY(4),
      queryFn: () => getAllGoodsAction({ limit: '4' }),
    }),
  ]);

  // Извлекаем данные из кеша
  const goodsData = queryClient.getQueryData<GoodsData>(GOODS_QUERY_KEY(4));
  const goods = goodsData?.goods ?? [];

  const slidesDataRaw = queryClient.getQueryData<IGetAllSlides>(
    SLIDES_QUERY_KEY(params)
  );
  const testimonialsDataRaw = queryClient.getQueryData<IGetAllTestimonials>(
    TESTIMONIALS_QUERY_KEY(params)
  );

  // Фильтруем только активные отзывы на клиенте (можно переносить на сервер)
  const testimonialsData = testimonialsDataRaw
    ? {
        ...testimonialsDataRaw,
        testimonials: testimonialsDataRaw.testimonials
          .filter((t: ITestimonial) => t.isActive)
          .map(t => JSON.parse(JSON.stringify(t))),
      }
    : null;

  const slidesData = slidesDataRaw
    ? {
        ...slidesDataRaw,
        slides: slidesDataRaw.slides.map(s => JSON.parse(JSON.stringify(s))),
      }
    : null;

  return (
    <HydrationBoundary state={safeState}>
      <div className="container">
        {slidesData && <BannerSlider slides={slidesData.slides} role={role} />}
        <DailyDealsSection goods={goods} title="Пропозиції дня" />
        {testimonialsData && (
          <TestimonialSlider testimonials={testimonialsData.testimonials} />
        )}
        <Advantages title="Переваги" />
      </div>
    </HydrationBoundary>
  );
}
