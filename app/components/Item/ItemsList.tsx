'use client'

import { getAllGoods } from '@/actions/getTest'
import { SItem } from '@/types/item/IItem'
import { ISearchParams } from '@/types/searchParams'
import useSWR from 'swr'
import { ItemListCard, Loader } from '..'

const ItemsList = (searchParams: { searchParams: ISearchParams }) => {
	const { data, error } = useSWR('data', () => getAllGoods(searchParams))

	if (error) {
		console.error('Error fetching goods:', error)
		return <div>Error fetching goods</div>
	}

	if (!data) {
		return <Loader />
	}
	const goods: SItem[] = JSON.parse(data)

	if (goods.length === 0) {
		return <h2 className='text-4xl mb-4'>Товар не знайдений</h2>
	}

	return (
		<ul className='grid grid-cols-4 gap-4'>
			{goods?.map(item => (
				<ItemListCard key={item._id} item={item} />
			))}
		</ul>
	)
}

export default ItemsList
