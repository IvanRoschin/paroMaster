import { QueryKey, useQuery } from '@tanstack/react-query';

export const useFetchData = <T,>(
  action: (params?: any) => Promise<T>,
  key: QueryKey,
  params?: any
) => {
  const { data, error, isError, isLoading, refetch } = useQuery<T, Error>({
    queryFn: () => action(params),
    queryKey: [key, JSON.stringify(params)],
  });
  return { data, error, isError, isLoading, refetch };
};
export default useFetchData;
