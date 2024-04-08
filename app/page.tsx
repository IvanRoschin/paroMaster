import { ItemsList, Slider } from './components'
import Sort from './components/Sort'

export default function Home({ searchParams }: { searchParams: { sort: string; search: string } }) {
	console.log('searchParams', searchParams)
	return (
		<div className=''>
			<Slider />
			<Sort />
			<ItemsList searchParams={searchParams} />
		</div>
	)
}
