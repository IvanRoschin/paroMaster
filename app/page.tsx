import { ItemsList } from './components'
import Slider from './components/Slider'

export default function Home() {
	return (
		<div className='container p-8 mx-auto'>
			<Slider />
			<ItemsList />
		</div>
	)
}
