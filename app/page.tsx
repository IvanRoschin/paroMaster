import { ISearchParams } from '@/types/searchParams'
import { getAllGoods } from './actions/getTest'
import { ItemsList, Slider } from './components'

export default async function Home(searchParams: ISearchParams) {
	const goods = await getAllGoods(searchParams)

	let newArray = ''

	if (goods) {
		newArray = JSON.stringify(goods)
	}

	return (
		<div className='container'>
			<Slider />
			<ItemsList goods={newArray} />
		</div>
	)
}
