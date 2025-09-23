import { QueryClient, QueryKey } from '@tanstack/react-query';

const prefetchData = async <T,>(
  queryClient: QueryClient,
  action: (params?: any) => Promise<T>,
  queryKey: QueryKey,
  params?: any
) => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => action(params),
  });
  return queryClient;
};

export default prefetchData;
