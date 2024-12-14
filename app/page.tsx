import { Advantages, Description, ItemsList, Slider, TestimonialsList } from '@/components/index'
import { IGood, ISearchParams, ITestimonial } from '@/types/index'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getAllGoods } from './actions/goods'
import { getAllSlides, IGetAllSlides } from './actions/slider'
import { getAllTestimonials, IGetAllTestimonials } from './actions/testimonials'

interface GoodsData {
	goods: IGood[]
}

const limit = 4

export default async function Home({ searchParams }: { searchParams: ISearchParams }) {
	const queryClient = new QueryClient()

	try {
		await queryClient.prefetchQuery({
			queryKey: ['slides'],
			queryFn: () => getAllSlides(searchParams, limit),
		})
		await queryClient.prefetchQuery({
			queryKey: ['testimonials'],
			queryFn: () => getAllTestimonials(searchParams, limit),
		})
		await queryClient.prefetchQuery({
			queryKey: ['goods'],
			queryFn: () => getAllGoods(searchParams, limit),
		})
	} catch (error) {
		console.error('Error prefetching data:', error)
	}

	const queryState = queryClient.getQueryState(['goods'])

	const goods = (queryState?.data as GoodsData)?.goods || []

	const slidesData = queryClient.getQueryData<IGetAllSlides>(['slides'])
	const testimonialsData = queryClient.getQueryData<IGetAllTestimonials>(['testimonials'])

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className='container'>
				<section className='hidden lg:block'>
					<Slider
						slidesData={slidesData}
						testimonialsData={testimonialsData}
						DescriptionComponent={Description}
					/>
				</section>
				<section>
					<ItemsList goods={goods} title='Пропозиції дня' />
				</section>
				<section>
					<div className='flex flex-col'>
						{testimonialsData && (
							<TestimonialsList
								testimonialsData={{
									...testimonialsData,
									testimonials: testimonialsData.testimonials.filter(
										(testimonial: ITestimonial) => testimonial.isActive,
									),
								}}
								title='Відгуки клієнтів'
							/>
						)}
					</div>
				</section>
				<section>
					<Advantages title='Переваги' />
				</section>
			</div>
		</HydrationBoundary>
	)
}
