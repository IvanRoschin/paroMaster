'use client'

import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

type Props = {}

const Slider = (props: Props) => {
	return (
		<div className='mb-9 '>
			<Swiper
				navigation
				pagination
				modules={[Navigation, Pagination]}
				slidesPerView={1}
				loop={true}
				className='h-[455px] w-full max-w-[1050px] rounded-lg swiper'
			>
				<SwiperSlide className=''>
					<div className='flex items-center justify-center h-full w-full'>
						<Image
							src='/slider/pic_01.webp'
							alt='Designed by Freepik'
							width={800}
							height={600}
							className='block h-full w-full object-cover'
						/>
					</div>
				</SwiperSlide>
				<SwiperSlide>
					<div className='flex items-center justify-center h-full w-full'>
						<Image
							src='/slider/pic_02.webp'
							alt='Designed by Freepik'
							width={800}
							height={600}
							className='block h-full w-full object-cover'
						/>
					</div>
				</SwiperSlide>
				<SwiperSlide>
					<div className='flex items-center justify-center h-full w-full'>
						<Image
							src='/slider/pic_03.webp'
							alt='Designed by Freepik'
							width={800}
							height={600}
							className='block h-full w-full object-cover'
						/>
					</div>
				</SwiperSlide>
			</Swiper>
		</div>
	)
}

export default Slider
