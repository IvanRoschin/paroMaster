'use client'

import { getAllCategories } from '@/actions/categories'
import { getMinMaxPrice } from '@/actions/goods'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import BrandFilter from './BrandFilter'
import Category from './Category'
import EmptyState from './EmptyState'
import Loader from './Loader'
import PriceFilter from './PriceFilter/PriceFilter'
import Sort from './Sort'

const limit = 10

const Sidebar = () => {
	const searchParams = useSearchParams()
	const {
		data: minMaxPriceData,
		isLoading: minMaxPriceIsLoading,
		isError: MaxPriceIsError,
	} = useQuery({
		queryKey: ['minMaxPrice', URLSearchParams],
		queryFn: () => getMinMaxPrice(),
	})
	const minMaxPrice = minMaxPriceData?.minMaxPrice

	const {
		data: categoriesData,
		isLoading: isCategorisLoading,
		isError: isCategoriesError,
	} = useQuery({
		queryKey: ['categories', searchParams],
		queryFn: () => getAllCategories(searchParams, limit),
	})

	const categories = categoriesData?.categories ?? []

	// Handle loading states
	if (isCategorisLoading || minMaxPriceIsLoading) {
		return <Loader />
	}

	if (isCategoriesError || MaxPriceIsError) {
		return <div>Error fetching data.</div>
	}
	// Handle errors
	if (!categories?.length && !minMaxPrice?.length) {
		return <EmptyState showReset />
	}

	if (minMaxPrice.minPrice === minMaxPrice.maxPrice) {
		minMaxPrice.maxPrice = minMaxPrice.minPrice + 100
	}

	return (
		<div>
			<Category categories={categories} />
			<PriceFilter minPrice={minMaxPrice?.minPrice} maxPrice={minMaxPrice?.maxPrice} />
			<Sort />
			<BrandFilter />
		</div>
	)
}

export default Sidebar
