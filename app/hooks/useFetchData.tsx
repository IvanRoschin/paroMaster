'use client'

import { useQuery } from '@tanstack/react-query'

function useFetchData<T>(
	params: any,
	limit: number,
	action: (params: any, limit: number) => Promise<T>,
	key: string,
) {
	const { data, isLoading, isError } = useQuery({
		queryKey: [key, params],
		queryFn: () => action(params, limit),
	})

	return { data, isError, isLoading }
}

export default useFetchData
