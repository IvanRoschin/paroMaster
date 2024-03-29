import { ItemsList } from './components'
import Slider from './components/Slider'

export default function Home() {
	return (
		<div className='container p-4 mx-auto'>
			<div className='flex justify-between items-center'>
				<Slider />
			</div>
			<ItemsList />
		</div>
	)
}
