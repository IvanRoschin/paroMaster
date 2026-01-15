import { getAllOrdersAction, getOrderByIdAction } from '@/actions/orders';
import { OrderForm } from '@/admin/components/index';
import { IGoodUI, ISearchParams } from '@/types/index';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

interface GoodsData {
  goods: IGoodUI[];
}

const SingleOrderPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<ISearchParams>;
}) => {
  const { id } = await params;
  const order = await getOrderByIdAction(id);
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ['orders'],
      queryFn: () => getAllOrdersAction(),
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
