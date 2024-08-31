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
import { IGood, ISearchParams, ISlider, ITestimonial } from '@/types/index'
import { useQuery } from '@tanstack/react-query'
import { getAllGoods, IGetAllGoods } from './actions/goods'
import { getAllSlides, IGetAllSlides } from './actions/slider'
import { getAllTestimonials, IGetAllTestimonials } from './actions/testimonials'

const limit = 4

const Home = ({ searchParams }: { searchParams: ISearchParams }) => {
	// const queryClient = useQueryClient()
	// Prefetch data on component mount
	// useEffect(() => {
	// 	const prefetch = async () => {
	// 		await queryClient.prefetchQuery({
	// 			queryKey: ['slides'],
	// 			queryFn: () => getAllSlides(searchParams, limit),
	// 			staleTime: 60000,
	// 		})
	// 		await queryClient.prefetchQuery({
	// 			queryKey: ['testimonials'],
	// 			queryFn: () => getAllTestimonials(searchParams, limit),
	// 			staleTime: 60000,
	// 		})
	// 		await queryClient.prefetchQuery({
	// 			queryKey: ['goods'],
	// 			queryFn: () => getAllGoods(searchParams, limit),
	// 			staleTime: 60000,
	// 		})
	// 	}

	// 	prefetch()
	// }, [queryClient, searchParams])

	const { data: slidesData, isLoading: isSlidesLoading, isError: isSlidesError } = useQuery<
		IGetAllSlides
	>({
		queryKey: ['slides'],
		queryFn: () => getAllSlides(searchParams, limit),
	})

	const slides: ISlider[] = slidesData?.slides ?? []

	const { data: goodsData, isLoading: isGoodsLoading, isError: isGoodsError } = useQuery<
		IGetAllGoods
	>({
		queryKey: ['goods'],
		queryFn: () => getAllGoods(searchParams, limit),
		enabled: !!searchParams,
	})

	const goods: IGood[] = goodsData?.goods ?? []

	const {
		data: testimonialsData,
		isLoading: isTestimonialsLoading,
		isError: isTestimonialsError,
	} = useQuery<IGetAllTestimonials>({
		queryKey: ['testimonials'],
		queryFn: () => getAllTestimonials(searchParams, limit),
		enabled: !!goodsData,
	})

	const testimonials: ITestimonial[] = testimonialsData?.testimonials ?? []

	//Handle loading
	if (isSlidesLoading || isGoodsLoading || isTestimonialsLoading) {
		return <Loader />
	}

	//Handle error
	if (isSlidesError || isGoodsError || isTestimonialsError) {
		return <div>Error fetching data.</div>
	}

	// Handle empty state
	if (goods.length === 0 && slides.length === 0 && testimonials.length === 0) {
		return <EmptyState showReset />
	}

	console.log('goods', goods)
	console.log('slides', slides)
	console.log('testimonials', testimonials)

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
