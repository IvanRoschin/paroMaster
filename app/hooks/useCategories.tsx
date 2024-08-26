'use client'

import { getAllCategories } from '@/actions/categories'
import { ISearchParams } from '@/types/searchParams'
import useSWR from 'swr'

const limit = 10
function useGetCategories(params: ISearchParams) {
	const { data, error, isLoading } = useSWR(['categories', params], () =>
		getAllCategories(params, limit),
	)

	return { data, error, isLoading }
}

export default useGetCategories
