'use client'
import { getMinMaxPrice } from '@/actions/goods'
import useSWR from 'swr'
import BrandFilter from './BrandFilter'
import Category from './Category'
import Loader from './Loader'
import PriceFilter from './PriceFilter/PriceFilter'
import Sort from './Sort'

const Sidebar = () => {
	const { data: minMaxPrice, error } = useSWR('minMaxPrice', getMinMaxPrice)

	if (error) {
		console.error('Error fetching min and max price:', error)
	}
	if (!minMaxPrice) {
		// Loading state
		return <Loader />
	}
	return (
		<div>
			<Category />
			<PriceFilter minPrice={minMaxPrice.minPrice} maxPrice={minMaxPrice.maxPrice} />
			<Sort />
			<BrandFilter />
		</div>
	)
}

export default Sidebar
