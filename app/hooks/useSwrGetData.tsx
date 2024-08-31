'use client'

import { ISearchParams } from '@/types/searchParams'
import useSWR from 'swr'

function useSwrGetData<T>(
	params: ISearchParams | undefined,
	limit: number | undefined,
	action: (params?: ISearchParams, limit?: number) => Promise<T>,
	key: string,
) {
	const { data, error, isValidating: isLoading } = useSWR<T>([key, params], () =>
		action(params, limit),
	)

	return { data, error, isLoading }
}

export default useSwrGetData
