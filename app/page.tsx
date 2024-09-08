import { Advantages, Description, ItemsList, Slider, TestimonialsList } from '@/components/index'
import { ISearchParams } from '@/types/index'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getAllGoods } from './actions/goods'
import { getAllSlides } from './actions/slider'
import { getAllTestimonials } from './actions/testimonials'

const limit = 4

export default async function Home({ searchParams }: { searchParams: ISearchParams }) {
	const queryClient = new QueryClient() // Corrected variable name

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

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className='container'>
				<Slider searchParams={searchParams} limit={limit} DescriptionComponent={Description} />
				<h2 className='m-4 ml-0 text-2xl text-primaryAccentColor mb-4 bold'>Пропозиції дня</h2>
				<ItemsList searchParams={searchParams} limit={limit} />
				<div className='flex flex-col'>
					<h2 className='m-4 ml-0 text-2xl text-primaryAccentColor mb-4 bold'>Відгуки клієнтів</h2>
					<TestimonialsList searchParams={searchParams} limit={limit} />
					<h2 className='m-4 ml-0 text-2xl text-primaryAccentColor mb-4 bold'>Переваги</h2>
					<Advantages />
				</div>
			</div>
		</HydrationBoundary>
	)
}
