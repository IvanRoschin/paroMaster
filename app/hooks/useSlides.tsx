'use client'

import { getAllSlides } from '@/actions/slider'
import { ISearchParams } from '@/types/searchParams'

import useSWR from 'swr'

function useGetSlides(params: ISearchParams, limit: number) {
	const { data, error, isLoading } = useSWR(['slides', params], () => getAllSlides(params, limit))

	return { data, error, isLoading }
}

export default useGetSlides
