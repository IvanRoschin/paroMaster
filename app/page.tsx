'use client'

import {
	Advantages,
	Description,
	EmptyState,
	ItemsList,
	Loader,
	Slider,
	TestimonialsList,
} from '@/components/index'
import { ISearchParams } from '@/types/index'
import { useQuery } from '@tanstack/react-query'
import { getAllGoods } from './actions/goods'
import { getAllSlides } from './actions/slider'
import { getAllTestimonials } from './actions/testimonials'
// import useGetGoods from './hooks/useGoods'
// import useGetSlides from './hooks/useSlides'

const limit = 4

const Home = ({ searchParams }: { searchParams: ISearchParams }) => {
	//React Query
	// Fetch goods data
	const { data: goodsData, isLoading: isGoodsLoading, isError: isGoodsError } = useQuery({
		queryKey: ['goods', searchParams],
		queryFn: () => getAllGoods(searchParams, limit),
	})
	const goods = goodsData?.goods ?? []

	// Fetch slides data
	const { data: slidesData, isLoading: isSlidesLoading, isError: isSlidesError } = useQuery({
		queryKey: ['slides', searchParams],
		queryFn: () => getAllSlides(searchParams, limit),
	})
	const slides = slidesData?.slides ?? []

	// Fetch testimonials data

	const {
		data: testimonialsData,
		isLoading: isTestimonialsLoading,
		isError: isTestimonialsError,
	} = useQuery({
		queryKey: ['testimonials', searchParams],
		queryFn: () => getAllTestimonials(searchParams, limit),
	})
	const testimonials = testimonialsData?.testimonials ?? []

	// Handle loading states
	if (isGoodsLoading || isSlidesLoading || isTestimonialsLoading) {
		return <Loader />
	}

	// Handle errors
	if (isGoodsError || isSlidesError || isTestimonialsError) {
		return <div>Error fetching data.</div>
	}

	// Handle empty state
	if (!goods?.length && !slides?.length && !testimonials?.length) {
		return <EmptyState showReset />
	}

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
