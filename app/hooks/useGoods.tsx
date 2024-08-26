'use client'

import { getAllGoods } from '@/actions/goods'
import { ISearchParams } from '@/types/searchParams'
import useSWR from 'swr'

function useGetGoods(params: ISearchParams, limit: number) {
	const { data, error, isLoading } = useSWR(['goods', params], () => getAllGoods(params, limit))

	return { data, error, isLoading }
}

export default useGetGoods
