import { QueryClient, QueryKey } from "@tanstack/react-query"

const usePrefetchData = async <T,>(
  action: (params?: any) => Promise<T>,
  key: QueryKey,
  params?: any
) => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: [key, JSON.stringify(params)],
    queryFn: () => action(params)
  })
  return queryClient
}

export default usePrefetchData
