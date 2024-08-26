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

const limit = 2

const fetcher = async (url: string, params: ISearchParams): Promise<IGetAllGoodsResponse> => {
	return getAllGoods(params, limit)
}

const CatalogPage = ({ searchParams }: { searchParams: ISearchParams }) => {
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
			<h2 className='title mb-1'>Каталог товарів</h2>
			<h3>
				Всього товарів в базі: <span className='text-primaryAccentColor'>{data.count}</span>
			</h3>
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

export default CatalogPage
