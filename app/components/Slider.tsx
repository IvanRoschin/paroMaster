'use client'

import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import { A11y, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

type Props = {}

const Slider = (props: Props) => {
	return (
		<div className='mb-9'>
			<Swiper
				modules={[Navigation, A11y]}
				slidesPerView={1}
				breakpoints={{
					768: { slidesPerView: 1 },
					1440: { slidesPerView: 1, spaceBetween: 30 },
					1920: { slidesPerView: 1, spaceBetween: 10 },
				}}
				spaceBetween={30}
				loop={true}
				navigation
			>
				<SwiperSlide>
					<Image
						src='/slider/pic_01.webp'
						alt='Designed by Freepik'
						width={0}
						height={0}
						sizes='100vw'
						style={{ width: '100%', height: 'auto' }}
					/>
				</SwiperSlide>
				<SwiperSlide>
					<Image
						src='/slider/pic_02.webp'
						alt='Designed by Freepik'
						width={0}
						height={0}
						sizes='100vw'
						style={{ width: '100%', height: 'auto' }}
					/>
				</SwiperSlide>
				<SwiperSlide>
					<Image
						src='/slider/pic_03.webp'
						alt='Designed by Freepik'
						width={0}
						height={0}
						sizes='100vw'
						style={{ width: '100%', height: 'auto' }}
					/>
				</SwiperSlide>
			</Swiper>
		</div>
	)
}

export default Slider
