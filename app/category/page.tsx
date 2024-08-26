'use client'

import { getAllGoods } from '@/actions/goods'
import InfiniteScrollGoods from '@/components/InfiniteScrollGoods'
import { IGood } from '@/types/index'
import { ISearchParams } from '@/types/searchParams'
import useSWR from 'swr'
import { EmptyState, Loader } from '../components'

interface IGetAllGoodsResponse {
	success: boolean
	goods: IGood[]
	count: number
}

const limit = 2

const fetcher = async (url: string, params: ISearchParams): Promise<IGetAllGoodsResponse> => {
	return getAllGoods(params, limit)
}

export default async function categoryPage({ searchParams }: { searchParams: ISearchParams }) {
	const { data, error } = useSWR(['goods', searchParams], () => fetcher('goods', searchParams))

	if (error) {
		console.error('Error fetching goods', error)
	}
	if (data?.goods.length === 0) {
		return <EmptyState showReset />
	}
	if (!data) {
		return <Loader />
	}

	return (
		<div>
			<h2 className='text-4xl mb-4'>{searchParams?.category}</h2>
			{/* <ItemsList goods={data.goods} /> */}
			<div key={Math.random()}>
				<InfiniteScrollGoods
					initialGoods={data.goods}
					search={searchParams}
					NUMBER_OF_GOODS_TO_FETCH={limit}
				/>
			</div>
		</div>
	)
}
