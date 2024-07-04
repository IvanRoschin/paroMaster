'use client'

import { IGood } from '@/types/good/IGood'
import { ItemListCard } from '..'

const ItemsList = ({ goods }: { goods: IGood[] }) => {
	if (goods.length === 0) {
		return <h2 className='text-4xl mb-4'>Товар не знайдений</h2>
	}

	return (
		<>
			<ul key={Math.random()} className='grid grid-cols-4 gap-4'>
				{goods?.map((item: IGood, index) => (
					<ItemListCard key={index} item={item} />
				))}
			</ul>
		</>
	)
}

export default ItemsList
