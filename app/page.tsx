import { ItemsList, Slider } from './components'

type HomePageProps = {
	searchParams: {
		search?: string | undefined
	}
	params: any
}
export default function Home(props: HomePageProps) {
	return (
		<div className=''>
			<Slider />
			<ItemsList searchParams={props.searchParams} />
		</div>
	)
}
