import { QueryKey, useQuery } from "@tanstack/react-query"

const useFetchData = <T,>(action: (params?: any) => Promise<T>, key: QueryKey, params?: any) => {
  const { data, isLoading, error, isError, refetch } = useQuery<T, Error>({
    queryKey: [key, JSON.stringify(params)],
    queryFn: () => action(params)
  })

  return { data, error, isError, isLoading, refetch }
}

export default useFetchData
