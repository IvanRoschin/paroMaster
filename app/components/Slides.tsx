// 'use client'

// import { getAllSlides } from '@/actions/slider'
// import { ISearchParams } from '@/types/searchParams'
// import { useSearchParams } from 'next/navigation'
// import useSWR from 'swr'
// import Loader from './Loader'

// const limit = 10

// const getSlides = () => {
// 	const searchParams = useSearchParams()

// 	const searchParamsObject: ISearchParams = {
// 		low: searchParams.get('low') || '',
// 		high: searchParams.get('high') || '',
// 		category: searchParams.get('category') || '',
// 	}

// 	const { data, error } = useSWR(['categories', searchParams], () =>
// 		getAllSlides(searchParamsObject, limit),
// 	)

// 	if (error) {
// 		console.error('Error fetching categories:', error)
// 	}
// 	console.log('data', data)

// 	if (!data?.slides) {
// 		// Show a loader or placeholder while data is being fetched
// 		return <Loader />
// 	}

// 	const { slides } = data

// 	return slides
// }

// export default getSlides

// import Image from 'next/image'
// import { imagePaths } from './ImagesPaths'

// export const slides = imagePaths.map(item => (
// 	<Image
// 		key={item.id}
// 		src={item.src}
// 		alt={item.title}
// 		width={400}
// 		height={400}
// 		className='w-full h-[80vh] object-cover md:rounded-tl-3xl md:rounded-bl-3xl'
// 	/>
// ))
