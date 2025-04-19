import { ISearchParams } from "@/types/searchParams"
import { QueryClient } from "@tanstack/react-query"

export async function usePrefetchData<T>(
  action: (params: ISearchParams) => Promise<T>,
  key: string,
  params: ISearchParams
) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: [key],
    queryFn: () => action(params)
  })
  return queryClient
}
