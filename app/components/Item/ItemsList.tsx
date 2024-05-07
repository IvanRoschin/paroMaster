'use client'

import { getAllGoods } from '@/actions/getTest'
import { ISearchParams } from '@/types/searchParams'
import useSWR from 'swr'
import { ItemListCard, Loader } from '..'

const ItemsList = (searchParams: { searchParams: ISearchParams }) => {
	const { data: goods, error } = useSWR('goods', () => getAllGoods(searchParams))

	if (error) {
		console.error('Error fetching goods:', error)
	}
	if (!goods) {
		return <Loader />
	}

	if (goods?.length === 0) {
		return <h2 className='text-4xl mb-4'>Товар не знайдений</h2>
	}

	return (
		<ul className='grid grid-cols-4 gap-4'>
			{goods?.map(item => (
				<ItemListCard
					key={item._id}
					item={{
						_id: item._id,
						category: item.category,
						imgUrl: item.imgUrl,
						brand: item.brand,
						model: item.model,
						vendor: item.vendor,
						title: item.title,
						description: item.description,
						price: item.price,
						isAvailable: item.isAvailable,
						isCompatible: item.isCompatible,
						compatibility: item.compatibility,
					}}
				/>
			))}
		</ul>
	)
}

export default ItemsList
