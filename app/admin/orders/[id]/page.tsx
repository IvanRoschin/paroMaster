import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getAllOrders, getOrderById } from '@/actions/orders';
import { OrderForm } from '@/admin/components/index';
import { IGood, ISearchParams } from '@/types/index';

interface GoodsData {
  goods: IGood[];
}

const SingleOrderPage = async ({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) => {
  const params = await searchParams;
  const { id } = params;
  const order = await getOrderById(id);
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ['orders'],
      queryFn: () => getAllOrders(params),
    });
  } catch (error) {
    console.error('Error prefetching data:', error);
  }
  const queryState = queryClient.getQueryState(['goods']);
  const goods = (queryState?.data as GoodsData)?.goods || [];

  if (!order) {
    return;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mb-20">
        <OrderForm
          order={order}
          title={`Редагувати дані ордера ${order.number}`}
          goods={goods}
        />
      </div>
    </HydrationBoundary>
  );
};

export default SingleOrderPage;
