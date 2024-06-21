import { getAllGoods } from '@/actions/goods'
import { ISearchParams } from '@/types/searchParams'
import { ItemsList } from '../components'

export default async function categoryPage({ searchParams }: { searchParams: ISearchParams }) {
	const goods = await getAllGoods(searchParams, 0, 8)

	return (
		<div>
			<h2 className='text-4xl mb-4'>{searchParams?.category}</h2>
			<ItemsList goods={goods} />
		</div>
	)
}
