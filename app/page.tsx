import Button from '@/components/Button'
import { ISearchParams } from '@/types/searchParams'
import { useRouter } from 'next/router'
import { getAllGoods } from './actions/goods'
import { ItemsList, Slider } from './components'

export default async function Home({ searchParams }: { searchParams: ISearchParams }) {
	const goods = await getAllGoods(searchParams, 0, 4)
	return (
		<div className='container'>
			<Slider />
			<ItemsList goods={goods} />
		</div>
	)
}
