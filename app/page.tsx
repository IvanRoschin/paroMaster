import { ISearchParams } from '@/types/searchParams'
import { getAllGoods } from './actions/goods'
import { ItemsList, Slider } from './components'

export default async function Home({ searchParams }: { searchParams: ISearchParams }) {
	const data = await getAllGoods(searchParams, 0, 4)

	return (
		<div className='container'>
			<Slider />
			<ItemsList goods={data.goods} />
		</div>
	)
}
