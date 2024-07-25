'use client'

import { getAllGoods } from '@/actions/goods'
import EmptyState from '@/components/EmptyState'
import InfiniteScrollGoods from '@/components/InfiniteScrollGoods'
import { IGood } from '@/types/good/IGood'
import { ISearchParams } from '@/types/searchParams'
import useSWR from 'swr'
import { Loader } from '../components'

interface IGetAllGoodsResponse {
	success: boolean
	goods: IGood[]
	count: number
}

const NUMBER_OF_GOODS_TO_FETCH = 4

const fetcher = async (url: string, params: ISearchParams): Promise<IGetAllGoodsResponse> => {
	return getAllGoods(params, 0, NUMBER_OF_GOODS_TO_FETCH)
}

const Page = ({ searchParams }: { searchParams: ISearchParams }) => {
	const { data, error } = useSWR(['goods', searchParams], () => fetcher('goods', searchParams))

	if (error) {
		console.error('Error fetching goods', error)
	}
	if (data?.goods.length === 0) {
		return <EmptyState />
	}
	if (!data) {
		return <Loader />
	}
	// const data = await getAllGoods(searchParams, 0, NUMBER_OF_GOODS_TO_FETCH)

	return (
		<div>
			<h2 className='text-4xl mb-4 flex justify-start items-start'>Каталог товарів</h2>
			<InfiniteScrollGoods
				initialGoods={data.goods}
				searchParams={searchParams}
				NUMBER_OF_GOODS_TO_FETCH={NUMBER_OF_GOODS_TO_FETCH}
			/>
		</div>
	)
}

export default Page
