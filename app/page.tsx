'use client'

import { IGood } from '@/types/good/IGood'
import { ISearchParams } from '@/types/searchParams'
import useSWR from 'swr'
import { getAllGoods } from './actions/goods'
import { ItemsList, Loader, Slider } from './components'
import Advantages from './components/Advantages'
import EmptyState from './components/EmptyState'
import TestimonialsList from './components/Testimonials'
import Description from './components/Description'
import { slides } from './components/Slides'

interface GoodsResponse {
	success: boolean
	goods: IGood[]
	count: number
}

const fetcher = async (url: string, params: ISearchParams): Promise<GoodsResponse> => {
	return getAllGoods(params, 0, 4)
}
const Home = ({ searchParams }: { searchParams: ISearchParams }) => {
	const { data, error } = useSWR(['goods', searchParams], () => fetcher('goods', searchParams))

	if (error) {
		console.error('Error fetching goods', error)
	}
	if (data?.goods.length === 0) {
		return <EmptyState />
	}
	if (!data) {
		return <Loader />
	}

	return (
		<div className='container'>
			<Slider slides={slides} DescriptionComponent={Description} />
			<h2 className='m-4 ml-0 text-2xl text-primaryAccentColor mb-4 bold'>Пропозиції дня</h2>
			<ItemsList goods={data.goods} />
			<div className='flex flex-col'>
				<h2 className='m-4 ml-0 text-2xl text-primaryAccentColor mb-4 bold'>Відгуки клієнтів</h2>
				<TestimonialsList />
				<h2 className='m-4 ml-0 text-2xl text-primaryAccentColor mb-4 bold'>Переваги</h2>
				<Advantages />
			</div>
		</div>
	)
}

export default Home
