"use client"

import { QueryKey, useQuery } from "@tanstack/react-query"

const useFetchDataById = <T,>(action: (id: string) => Promise<T>, key: QueryKey, id: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [key, id],
    queryFn: async () => action(id)
  })

  return { data, isError, isLoading, error, refetch }
}

export default useFetchDataById
