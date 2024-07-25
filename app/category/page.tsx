'use client'

import { getAllGoods } from '@/actions/goods'
import EmptyState from '@/components/EmptyState'
import { IGood } from '@/types/good/IGood'
import { ISearchParams } from '@/types/searchParams'
import useSWR from 'swr'
import { ItemsList, Loader } from '../components'

interface IGetAllGoodsResponse {
	success: boolean
	goods: IGood[]
	count: number
}

const fetcher = async (url: string, params: ISearchParams): Promise<IGetAllGoodsResponse> => {
	return getAllGoods(params, 0, 8)
}
export default function categoryPage({ searchParams }: { searchParams: ISearchParams }) {
	const { data, error } = useSWR(['goods', searchParams], () => fetcher('goods', searchParams))

	if (error) {
		console.error('Error fetching goods', error)
	}
	if (data?.goods.length === 0) {
		return <EmptyState category={searchParams.category} />
	}
	if (!data) {
		return <Loader />
	}

	return (
		<div>
			<h2 className='text-4xl mb-4'>{searchParams?.category}</h2>
			<ItemsList goods={data.goods} />
		</div>
	)
}
