import Catalog from './components/Catalog'
import Gallery from './components/Gallery'
import Header from './components/Header'
import Slider from './components/Slider'

export default function Home() {
	return (
		<div className='container p-4'>
			<Header />
			<div className='flex justify-between items-center'>
				<Catalog />
				<Slider />
			</div>
			<Gallery />
		</div>
	)
}
