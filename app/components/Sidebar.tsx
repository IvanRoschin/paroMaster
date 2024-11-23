'use client'

import { IGetAllCategories } from '@/actions/categories'
import { IGetAllBrands, IGetPrices } from '@/actions/goods'
import BrandFilter from './BrandFilter'
import Category from './Category'
import PriceFilter from './PriceFilter/PriceFilter'
import Sort from './Sort'

interface SidebarProps {
	pricesData: IGetPrices
	categoriesData: IGetAllCategories
	brandsData: IGetAllBrands
}

export default function Sidebar({ pricesData, categoriesData, brandsData }: SidebarProps) {
	return (
		<div>
			<Category categories={categoriesData?.categories} />
			<PriceFilter minPrice={pricesData?.minPrice} maxPrice={pricesData?.maxPrice} />
			<Sort />
			<BrandFilter brands={brandsData?.brands} />
		</div>
	)
}
