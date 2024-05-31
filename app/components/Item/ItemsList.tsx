'use client'

import { IItem } from '@/types/item/IItem'
import { ItemListCard } from '..'

const ItemsList = ({ goods }: { goods: string }) => {
	const newGoods = JSON.parse(goods)

	if (newGoods.length === 0) {
		return <h2 className='text-4xl mb-4'>Товар не знайдений</h2>
	}

	return (
		<ul className='grid grid-cols-4 gap-4'>
			{newGoods?.map((item: IItem) => (
				<ItemListCard key={item._id} item={item} />
			))}
		</ul>
	)
}

export default ItemsList
