import { QueryKey, useQuery } from "@tanstack/react-query"

export const useFetchData = <T,>(
  action: (params?: any) => Promise<T>,
  key: QueryKey,
  params?: any
) => {
  const { data, isLoading, error, isError, refetch } = useQuery<T, Error>({
    queryKey: [key, params],
    queryFn: () => action(params)
  })

  return { data, error, isError, isLoading, refetch }
}
