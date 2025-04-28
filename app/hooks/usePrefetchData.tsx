import { QueryClient, QueryKey } from "@tanstack/react-query"

export async function usePrefetchData<T>(
  action: (params?: any) => Promise<T>,
  key: QueryKey,
  params?: any
) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: [key, params],
    queryFn: () => action(params)
  })
  return queryClient
}
