'use client'

import { getAllGoods } from '@/actions/goods'
import { IGood } from '@/types/good/IGood'
import { ISearchParams } from '@/types/searchParams'
import useFetchData from 'app/hooks/useFetchData'
import EmptyState from '../EmptyState'
import Loader from '../Loader'
import ItemListCard from './ItemListCard'

const ItemsList = ({ searchParams, limit }: { searchParams: ISearchParams; limit: number }) => {
	const { data, isLoading, isError } = useFetchData(searchParams, limit, getAllGoods, 'goods')

	if (isLoading) {
		return <Loader />
	}

	if (isError) {
		return <div>Error fetching data.</div>
	}

	if (!data?.goods || data.goods.length === 0) {
		return <EmptyState showReset />
	}
	const goods = data.goods as IGood[]

	return (
		<>
			<ul
				key={Math.random()}
				className='grid xl:grid-cols-4 gap-4 mb-20 md:grid-cols-2 grid-cols-1'
			>
				{goods?.map((item: IGood, index) => (
					<ItemListCard key={index} item={item} />
				))}
			</ul>
		</>
	)
}

export default ItemsList
