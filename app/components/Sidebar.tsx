'use client'

import { getAllCategories } from '@/actions/categories'
import { getMinMaxPrice } from '@/actions/goods'
import useFetchData from 'app/hooks/useFetchData'
import useSwrGetData from 'app/hooks/useGoods'
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

	const { data: pricesData, isLoading: isPricesLoading, error: isPricesError } = useSwrGetData(
		searchParams,
		limit,
		getMinMaxPrice,
		'prices',
	)

	const {
		data: categoriesData,
		isLoading: isCategorisLoading,
		isError: isCategoriesError,
	} = useFetchData(searchParams, limit, getAllCategories, 'categories')

	// Handle loading states
	if (isCategorisLoading || isPricesLoading) {
		return <Loader />
	}

	if (isCategoriesError || isPricesError) {
		return <div>Error fetching data.</div>
	}

	// Handle errors
	if (!categoriesData || !pricesData) {
		return <EmptyState showReset />
	}

	return (
		<div>
			<Category categories={categoriesData?.categories} />
			<Sort />
			<BrandFilter />
			<PriceFilter minPrice={pricesData?.minPrice} maxPrice={pricesData?.maxPrice} />
		</div>
	)
}

export default Sidebar
