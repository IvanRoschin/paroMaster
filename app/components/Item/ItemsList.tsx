'use client'

import { IGood } from '@/types/good/IGood'
import EmptyState from '../EmptyState'
import ItemListCard from './ItemListCard'

const ItemsList = ({ goods }: { goods: IGood[] }) => {
	if (goods.length === 0) {
		return <EmptyState />
	}

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
