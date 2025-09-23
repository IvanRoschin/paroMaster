import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getAllGoods } from '@/actions/goods';
import { OrderForm } from '@/admin/components';
import { IGood } from '@/types/index';
import { ISearchParams } from '@/types/searchParams';

interface GoodsData {
  goods: IGood[];
}

export const dynamic = 'force-dynamic';

const AddOrderPage = async ({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) => {
  const params = await searchParams;
  const queryClient = new QueryClient();

  const goodsKey = ['goods', params];

  await queryClient.prefetchQuery({
    queryKey: goodsKey,
    queryFn: () => getAllGoods(params),
  });

  const goods = (queryClient.getQueryData(goodsKey) as GoodsData)?.goods || [];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mb-20">
        <OrderForm title="Додати новий ордер" goods={goods} />
      </div>
    </HydrationBoundary>
  );
};

export default AddOrderPage;
