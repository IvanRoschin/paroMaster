'use client'

import Image from 'next/image'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

type Props = {}

const Slider = (props: Props) => {
	return (
		<div className='mb-9 swiper-container'>
			<Swiper
				modules={[Navigation, Pagination, EffectFade, Autoplay]}
				navigation={{
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				}}
				pagination={{
					clickable: true,
				}}
				className='h-[455px] max-w-[1050px] rounded-lg'
				effect='fade'
				speed={800}
				autoplay={{ delay: 5000 }}
				keyboard={{
					enabled: true,
				}}
				slidesPerView={1}
				loop
			>
				<SwiperSlide>
					<Image
						src='/slider/pic_01.webp'
						alt='Designed by Freepik'
						width={400}
						height={300}
						className='block h-full w-full object-cover'
					/>
				</SwiperSlide>
				<SwiperSlide>
					<Image
						src='/slider/pic_02.webp'
						alt='Designed by Freepik'
						width={400}
						height={300}
						className='block h-full w-full object-cover'
					/>
				</SwiperSlide>
				<SwiperSlide>
					<Image
						src='/slider/pic_03.webp'
						alt='Designed by Freepik'
						width={400}
						height={300}
						className='block h-full w-full object-cover'
					/>
				</SwiperSlide>
			</Swiper>
			<div className='button-arrangment flex justify-between'>
				<div className='swiper-button-prev'>
					<IoIosArrowDropleft />
				</div>
				<div className='swiper-button-next'>
					<IoIosArrowDropright />
				</div>
			</div>
		</div>
	)
}

export default Slider
