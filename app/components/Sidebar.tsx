'use client'

import { getAllCategories, IGetAllCategories } from '@/actions/categories'
import { getMinMaxPrice, uniqueBrands } from '@/actions/goods'
import { ICategory } from '@/types/index'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import BrandFilter from './BrandFilter'
import Category from './Category'
import EmptyState from './EmptyState'
import Loader from './Loader'
import PriceFilter from './PriceFilter/PriceFilter'
import Sort from './Sort'

const limit = 10
const Sidebar = () => {
	const searchParams = useSearchParams()

	const { data: pricesData, isLoading: isPricesLoading, error: isPricesError } = useSWR(
		'pricesData',
		getMinMaxPrice,
	)

	const {
		data: categoriesData,
		isLoading: isCategoriesLoading,
		isError: isCategoriesError,
	} = useQuery<IGetAllCategories>({
		queryKey: ['categories'],
		queryFn: () => getAllCategories(searchParams, limit),
		enabled: !!pricesData,
	})

	const categories: ICategory[] = categoriesData?.categories ?? []

	const { data: brandsData, isLoading: isBrandsLoading, error: isBrandsError } = useSWR(
		'brands',
		uniqueBrands,
	)

	const brands: string[] = brandsData?.brands ?? []

	if (isPricesLoading) {
		return <Loader />
	}
	if (isPricesError) {
		return <div>Error fetching priceData.</div>
	}
	if (!pricesData) {
		return <EmptyState showReset />
	}

	if (isCategoriesLoading) {
		return <Loader />
	}
	if (isCategoriesError) {
		return <div>Error fetching categoryData.</div>
	}
	if (!categoriesData) {
		return <EmptyState showReset />
	}

	if (isBrandsLoading) {
		return <Loader />
	}
	if (isBrandsError) {
		return <div>Error fetching brandsData.</div>
	}
	if (!brandsData) {
		return <EmptyState showReset />
	}

	return (
		<div>
			<Category categories={categories} />
			<PriceFilter minPrice={pricesData.minPrice} maxPrice={pricesData.maxPrice} />
			<Sort />
			<BrandFilter brands={brands} />
		</div>
	)
}

export default Sidebar
