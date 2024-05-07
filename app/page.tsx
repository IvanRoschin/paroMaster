import { ISearchParams } from '@/types/searchParams'
import { ItemsList, Slider } from './components'

export default function Home({ searchParams }: { searchParams: ISearchParams }) {
	return (
		<div className='container'>
			<Slider />
			<ItemsList searchParams={searchParams} />
		</div>
	)
}
