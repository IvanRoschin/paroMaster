import { ItemsList, Slider } from './components'
import Sort from './components/Sort'

type HomePageProps = {
	searchParams: {
		search?: string | null
		sort?: string | null
	}
	params: any
}
export default function Home(props: HomePageProps) {
	return (
		<div className=''>
			<Slider />
			<Sort />
			<ItemsList searchParams={props.searchParams} />
		</div>
	)
}
