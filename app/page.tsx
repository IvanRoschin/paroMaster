'use client'

import { Advantages, Description, ItemsList, Slider, TestimonialsList } from '@/components/index'
import { ISearchParams } from '@/types/index'
import { getAllGoods } from './actions/goods'
import { getAllSlides } from './actions/slider'
import { getAllTestimonials } from './actions/testimonials'
import useFetchData from './hooks/useFetchData'
import useSwrGetData from './hooks/useGoods'

const limit = 4

const Home = ({ searchParams }: { searchParams: ISearchParams }) => {
	const { data: slidesData, isLoading: isSlidesLoading, isError: isSlidesError } = useFetchData(
		searchParams,
		limit,
		getAllSlides,
		'slides',
	)

	const slides = slidesData?.slides ?? []

	console.log('slides', slides)

	const { data: goodsData, isLoading: isGoodsLoading, error: isGoodsError } = useSwrGetData(
		searchParams,
		limit,
		getAllGoods,
		'goods',
	)

	const goods = goodsData?.goods ?? []

	console.log('goods', goods)

	const {
		data: testimonialsData,
		isLoading: isTestimonialsLoading,
		error: isTestimonialsError,
	} = useSwrGetData(searchParams, limit, getAllTestimonials, 'testimonials')

	const testimonials = testimonialsData?.testimonials ?? []

	console.log('slides', slides)

	// if (isGoodsLoading || isSlidesLoading || isTestimonialsLoading) {
	// 	return <Loader />
	// }

	// // Handle errors
	// if (isGoodsError || isSlidesError || isTestimonialsError) {
	// 	return <div>Error fetching data.</div>
	// }

	// // Handle empty state
	// if (
	// 	!goods ||
	// 	!slides ||
	// 	!testimonials ||
	// 	goods?.length === 0 ||
	// 	slides?.length === 0 ||
	// 	testimonials?.length === 0
	// ) {
	// 	return <EmptyState showReset />
	// }

	return (
		<div className='container'>
			<Slider slides={slides} DescriptionComponent={Description} />
			<h2 className='m-4 ml-0 text-2xl text-primaryAccentColor mb-4 bold'>Пропозиції дня</h2>
			<ItemsList goods={goods} />
			<div className='flex flex-col'>
				<h2 className='m-4 ml-0 text-2xl text-primaryAccentColor mb-4 bold'>Відгуки клієнтів</h2>
				<TestimonialsList testimonials={testimonials} />
				<h2 className='m-4 ml-0 text-2xl text-primaryAccentColor mb-4 bold'>Переваги</h2>
				<Advantages />
			</div>
		</div>
	)
}

export default Home
