'use client'

import { IGood } from '@/types/good/IGood'
import { ItemListCard } from '..'
import EmptyState from '../EmptyState'

const ItemsList = ({ goods }: { goods: IGood[] }) => {
	if (goods.length === 0) {
		return <EmptyState />
	}

	return (
		<>
			<ul key={Math.random()} className='grid grid-cols-4 gap-4 mb-20'>
				{goods?.map((item: IGood, index) => (
					<ItemListCard key={index} item={item} />
				))}
			</ul>
		</>
	)
}

export default ItemsList
