import { ISearchParams } from '@/types/searchParams'
import { getAllGoods } from './actions/goods'
import { ItemsList, Slider } from './components'

export default async function Home({ searchParams }: { searchParams: ISearchParams }) {
	const goods = await getAllGoods(searchParams, 0, 4)
	return (
		<div className='container'>
			<Slider />
			<ItemsList goods={goods.data} />
		</div>
	)
}
