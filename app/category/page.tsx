import { getAllGoods } from '@/actions/goods'
import { ISearchParams } from '@/types/searchParams'
import { ItemsList } from '../components'

export default async function categoryPage({ searchParams }: { searchParams: ISearchParams }) {
	const goods = await getAllGoods(searchParams)

	let newArray = ''

	if (goods) {
		newArray = JSON.stringify(goods)
	}
	return (
		<div>
			<h2 className='text-4xl mb-4'>{searchParams?.category}</h2>
			<ItemsList goods={newArray} />
		</div>
	)
}
