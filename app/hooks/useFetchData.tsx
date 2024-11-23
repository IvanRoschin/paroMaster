'use client'

import { useQuery } from '@tanstack/react-query'

export const useFetchData = <T,>(
	params: any,
	limit: number,
	action: (params: any, limit: number) => Promise<T>,
	key: string,
) => {
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: [key, params],
		queryFn: () => action(params, limit),
	})

	return { data, isError, isLoading, refetch }
}
