"use client"

import { useQuery } from "@tanstack/react-query"

export const useFetchData = <T,>(
  params: any = {},
  action: (params: any) => Promise<T>,
  key: string
) => {
  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: [key],
    queryFn: async () => action(params)
  })

  return { data, error, isError, isLoading, refetch }
}
