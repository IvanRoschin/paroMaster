import { getServerSession } from 'next-auth';

import { CatalogPage } from '@/app/components';
import { authOptions } from '@/app/config/authOptions';
import { ISearchParams } from '@/types/index';
import { UserRole } from '@/types/IUser';

interface CustomerGoodsPageProps {
  searchParams: ISearchParams;
}

export default async function CustomerGoodsPage({
  searchParams,
}: CustomerGoodsPageProps) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role
    ? (session.user.role as UserRole)
    : UserRole.GUEST;

  return (
    <CatalogPage searchParams={Promise.resolve(searchParams)} role={role} />
  );
}
// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from '@tanstack/react-query';

// import { getAllBrands } from '@/actions/brands';
// import { getAllCategories } from '@/actions/categories';
// import { getAllGoods } from '@/actions/goods';
// import { Breadcrumbs } from '@/app/components';
// import prefetchData from '@/hooks/usePrefetchData';
// import { IGoodUI } from '@/types/index';
// import { ISearchParams } from '@/types/searchParams';
// import GoodsSection from './GoodsSection';

// interface GoodsData {
//   goods: IGoodUI[];
// }

// export default async function ProductsPage({
//   searchParams,
// }: {
//   searchParams: Promise<ISearchParams>;
// }) {
//   const params = await searchParams;
//   const queryClient = new QueryClient();

//   const goodsKey = ['goods', params];

//   await prefetchData(queryClient, getAllGoods, goodsKey, params);

//   const goodsData = queryClient.getQueryData<GoodsData>(goodsKey);
//   const goods = goodsData?.goods || [];

//   const [categoriesResponse, brandsResponse] = await Promise.all([
//     getAllCategories(params),
//     getAllBrands(params),
//   ]);

//   const categories = (categoriesResponse.categories ?? [])
//     .filter(c => c._id)
//     .map(c => ({
//       value: String(c._id),
//       label: c.name ?? 'Без назви',
//     }));

//   const brands = (brandsResponse.brands ?? [])
//     .filter(b => b._id)
//     .map(b => ({
//       value: String(b._id),
//       label: b.name ?? 'Без назви',
//     }));

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <div className="max-w-6xl mx-auto py-3 container">
//         <Breadcrumbs />
//         <h2 className="subtitle text-center">Каталог товарів</h2>
//         <GoodsSection
//           goods={goods}
//           searchParams={params}
//           categories={categories}
//           brands={brands}
//         />
//       </div>
//     </HydrationBoundary>
//   );
// }

// import { Metadata } from 'next';
// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from '@tanstack/react-query';

// import { IGoodUI, ISearchParams } from '@/types/index';
// import prefetchData from '@/hooks/usePrefetchData';
// import { Breadcrumbs, InfiniteScroll } from '@/components/index';
// import { getAllBrands } from '@/actions/brands';
// import { getAllCategories } from '@/actions/categories';
// import { getAllGoods } from '@/actions/goods';

// interface GoodsData {
//   goods: IGoodUI[];
// }

// export const metadata: Metadata = {
//   title: 'Каталог товарів | ParoMaster',
//   description:
//     'Великий каталог товарів для парогенераторів: запчастини, аксесуари, обладнання. Доставка по Україні. ParoMaster – надійний партнер у ремонті та сервісі.',
//   keywords: [
//     'каталог товарів',
//     'запчастини для парогенератора',
//     'купити парогенератор',
//     'ремонт парогенератора',
//     'ParoMaster',
//   ],
//   openGraph: {
//     title: 'Каталог товарів | ParoMaster',
//     description:
//       'Перегляньте повний каталог запчастин та обладнання для парогенераторів.',
//     url: `${process.env.PUBLIC_URL}/catalog`,
//     siteName: 'ParoMaster',
//     images: [
//       {
//         url: '/services/03.webp',
//         width: 1200,
//         height: 630,
//         alt: 'Каталог товарів ParoMaster',
//       },
//     ],
//   },
// };

// export default async function CatalogPage(props: {
//   searchParams: Promise<ISearchParams>;
// }) {
//   const params = await props.searchParams;
//   const queryClient = new QueryClient();

//   const goodsKey = ['goods', params];

//   await prefetchData(queryClient, getAllGoods, goodsKey, {
//     ...params,
//     limit: 8,
//   });

//   const goodsData = queryClient.getQueryData<GoodsData>(goodsKey);
//   const goods = goodsData?.goods || [];

//   const [categoriesResponse, brandsResponse] = await Promise.all([
//     getAllCategories(params),
//     getAllBrands(params),
//   ]);

//   const categories = (categoriesResponse.categories ?? [])
//     .filter(c => c._id)
//     .map(c => ({
//       value: String(c._id),
//       label: c.name ?? 'Без назви',
//     }));

//   const brands = (brandsResponse.brands ?? [])
//     .filter(b => b._id)
//     .map(b => ({
//       value: String(b._id),
//       label: b.name ?? 'Без назви',
//     }));

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <div className="max-w-6xl mx-auto py-3 container">
//         <Breadcrumbs />
//         <h2 className="subtitle text-center">Каталог товарів</h2>
//         <InfiniteScroll
//           initialGoods={goods}
//           searchParams={params}
//           categories={categories}
//           brands={brands}
//         />
//       </div>
//     </HydrationBoundary>
//   );
// }
