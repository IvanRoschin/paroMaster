import { IGoodUI, ISearchParams, ITestimonial } from '@/types/index';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getAllGoods } from '../actions/goods';
import { getAllSlides, IGetAllSlides } from '../actions/slider';
import {
  getAllTestimonials,
  IGetAllTestimonials,
} from '../actions/testimonials';
import {
  Advantages,
  Description,
  Slider,
  TestimonialsList,
} from '../components';
import DailyDealsSection from '../components/sections/DailyDealsSection';
import { generateMetadata } from '../helpers/generateMetadata';

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

  // Prefetch данных с обработкой ошибок
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: SLIDES_QUERY_KEY(params),
      queryFn: () => getAllSlides(params),
    }),
    queryClient.prefetchQuery({
      queryKey: TESTIMONIALS_QUERY_KEY(params),
      queryFn: () => getAllTestimonials(params),
    }),
    queryClient.prefetchQuery({
      queryKey: GOODS_QUERY_KEY(4),
      queryFn: () => getAllGoods({ limit: '4' }),
    }),
  ]);

  // Извлекаем данные из кеша
  const goodsData = queryClient.getQueryData<GoodsData>(GOODS_QUERY_KEY(4));
  const goods = goodsData?.goods ?? [];

  const slidesData = queryClient.getQueryData<IGetAllSlides>(
    SLIDES_QUERY_KEY(params)
  );
  const testimonialsDataRaw = queryClient.getQueryData<IGetAllTestimonials>(
    TESTIMONIALS_QUERY_KEY(params)
  );

  // Фильтруем только активные отзывы на клиенте (можно переносить на сервер)
  const testimonialsData = testimonialsDataRaw
    ? {
        ...testimonialsDataRaw,
        testimonials: testimonialsDataRaw.testimonials.filter(
          (t: ITestimonial) => t.isActive
        ),
      }
    : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container">
        {slidesData && testimonialsData && (
          <section className="hidden lg:block">
            <Slider
              slidesData={slidesData}
              testimonialsData={testimonialsData}
              DescriptionComponent={Description}
            />
          </section>
        )}
        <section>
          <DailyDealsSection goods={goods} title="Пропозиції дня" />
        </section>
        {testimonialsData && (
          <section>
            <div className="flex flex-col">
              <TestimonialsList
                testimonialsData={testimonialsData}
                title="Відгуки клієнтів"
              />
            </div>
          </section>
        )}
        <section>
          <Advantages title="Переваги" />
        </section>
      </div>
    </HydrationBoundary>
  );
}
