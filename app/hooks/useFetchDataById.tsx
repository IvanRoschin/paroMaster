"use client"

import { useQuery } from "@tanstack/react-query"

export const useFetchDataById = <T,>(
  id: string,
  action: (id: string) => Promise<T>,
  key: string
) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [key, id],
    queryFn: async () => action(id),
    enabled: !!id // Ensures the query runs only if `id` is defined
  })

  return { data, isError, isLoading, error }
}
