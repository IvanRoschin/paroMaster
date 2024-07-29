'use client'

import { ReactNode, useEffect, useState } from 'react'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'

// import { slides } from './constants'
// import Description from './Description'

interface SlidesData {
	id: number
	src: string
	title: string
	desc: string
}

interface SliderProps {
	slides: ReactNode[]
	DescriptionComponent?: React.FC<{
		activeImage: number
		clickNext: () => void
		clickPrev: () => void
	}>
}

const Slider: React.FC<SliderProps> = ({ slides, DescriptionComponent }) => {
	const [activeImage, setActiveImage] = useState(0)

	const clickNext = () => {
		activeImage === slides.length - 1 ? setActiveImage(0) : setActiveImage(activeImage + 1)
	}
	const clickPrev = () => {
		activeImage === 0 ? setActiveImage(slides.length - 1) : setActiveImage(activeImage - 1)
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			clickNext()
		}, 5000)
		return () => {
			clearTimeout(timer)
		}
	}, [activeImage])
	return (
		<main
			className={`grid 
				place-items-center 
				md:grid-cols-2
				grid-cols-1
				w-full mx-auto max-w-5xl shadow-2xl rounded-2xl mt-[40px]
				relative mb-20`}
		>
			<div
				className={`w-full flex justify-center items-center gap-4 transition-transform ease-in-out duration-500 md:rounded-2xl p-6 md:p-0`}
			>
				{slides.map((elem, idx) => (
					<div
						key={idx}
						className={`${
							idx === activeImage
								? 'block w-full h-full object-cover transition-all duration-500 ease-in-out items-center'
								: 'hidden'
						}`}
					>
						{elem}
					</div>
				))}
			</div>
			{!DescriptionComponent && (
				<div className='absolute md:bottom-1 bottom-10 right-10 md:right-0 w-full flex justify-center items-center'>
					<div className='absolute bottom-2 right-10 cursor-pointer' onClick={clickPrev}>
						<div className='swiper-button-prev'>
							<IoIosArrowDropleft />
						</div>{' '}
					</div>

					<div className='absolute bottom-2 right-2 cursor-pointer' onClick={clickNext}>
						<div className='swiper-button-next'>
							<IoIosArrowDropright />
						</div>
					</div>
				</div>
			)}
			{DescriptionComponent && (
				<DescriptionComponent
					activeImage={activeImage}
					clickNext={clickNext}
					clickPrev={clickPrev}
				/>
			)}

			{/* <div className='flex justify-between mt-4'>
				<button onClick={clickPrev} className='p-2 bg-gray-200 rounded-full'>
					&lt;
				</button>
				<button onClick={clickNext} className='p-2 bg-gray-200 rounded-full'>
					&gt;
				</button>
			</div> */}
		</main>
	)
}

export default Slider

// import 'swiper/css'
// import 'swiper/css/autoplay'
// import 'swiper/css/effect-fade'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'

// import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
// import { Swiper, SwiperSlide } from 'swiper/react'

// interface SliderProps {
// 	slides: ReactNode[]
// 	maxWidth?: string
// }
// const Slider: React.FC<SliderProps> = ({ slides, maxWidth }) => {
// 	return (
// 		<div className='mb-9 swiper-container'>
// 			<Swiper
// 				modules={[Navigation, Pagination, EffectFade, Autoplay]}
// 				navigation={{
// 					nextEl: '.swiper-button-next',
// 					prevEl: '.swiper-button-prev',
// 				}}
// 				pagination={{
// 					clickable: true,
// 				}}
// 				className={`max-h-[455px] max-w-[${maxWidth}px] rounded-lg`}
// 				effect='fade'
// 				speed={800}
// 				autoplay={{ delay: 5000 }}
// 				keyboard={{
// 					enabled: true,
// 				}}
// 				slidesPerView={1}
// 				loop
// 			>
// 				{slides.map((slide, index) => (
// 					<SwiperSlide key={index}>{slide}</SwiperSlide>
// 				))}
// 				{/* {sliderPaths.map((path, index) => (
// 					<SwiperSlide key={index}>
// 						<Image
// 							src={path}
// 							alt={`Slide ${index + 1}`}
// 							width={400}
// 							height={300}
// 							className='block h-full w-full object-cover'
// 						/>
// 					</SwiperSlide>
// 				))} */}
// 			</Swiper>
// 			<div className='button-arrangment flex justify-between'>
// 				<div className='swiper-button-prev'>
// 					<IoIosArrowDropleft />
// 				</div>
// 				<div className='swiper-button-next'>
// 					<IoIosArrowDropright />
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// export default Slider
