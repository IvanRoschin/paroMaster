'use client'

import { getAllGoods } from '@/actions/goods'
import InfiniteScrollGoods from '@/components/InfiniteScrollGoods'
import { ISearchParams } from '@/types/searchParams'
import useFetchData from 'app/hooks/useFetchData'
import { EmptyState, Loader } from '../components'

const limit = 4

const CatalogPage = ({ searchParams }: { searchParams: ISearchParams }) => {
	const { data, isLoading, isError } = useFetchData(searchParams, limit, getAllGoods, 'goods')

	if (isLoading) {
		return <Loader />
	}
	if (isError) {
		return <div>Error fetching data.</div>
	}

	if (!data || data?.goods.length === 0) {
		return <EmptyState showReset />
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
