"use client"

import { useQuery } from "@tanstack/react-query"

export const useFetchData = <T,>(
  params: any,
  limit: number,
  action: (params: any, limit: number) => Promise<T>,
  key: string
) => {
  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: [key, params],
    queryFn: async () => action(params, limit)
  })

  return { data, error, isError, isLoading, refetch }
}
