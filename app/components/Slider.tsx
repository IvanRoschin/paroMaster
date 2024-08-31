'use client'

import { ISlider } from '@/types/index'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import { FaPen } from 'react-icons/fa'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'

interface SliderProps {
	slides: (ISlider | ReactNode)[]
	testimonials?: boolean
	DescriptionComponent?: React.ComponentType<{
		activeImage: number
		clickNext: () => void
		clickPrev: () => void
		slides: (ISlider | ReactNode)[]
		testimonials?: boolean
	}>
}

const Slider: React.FC<SliderProps> = ({ slides, DescriptionComponent, testimonials }) => {
	const [activeImage, setActiveImage] = useState(0)
	const { data: session } = useSession()

	const isAdmin = session?.user

	const clickNext = () => {
		setActiveImage(prevActiveImage =>
			prevActiveImage === slides.length - 1 ? 0 : prevActiveImage + 1,
		)
	}

	const clickPrev = () => {
		setActiveImage(prevActiveImage =>
			prevActiveImage === 0 ? slides.length - 1 : prevActiveImage - 1,
		)
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			clickNext()
		}, 5000)
		return () => clearTimeout(timer)
	}, [activeImage])

	return (
		<main
			className={`grid 
        place-items-center 
        ${testimonials ? 'grid-cols-1' : 'grid-cols-2'}
        w-full 
        mx-auto 
        max-w-5xl 
        shadow-2xl 
        rounded-2xl 
        mt-[40px] 
        relative 
        mb-20`}
		>
			<div
				className={`w-full flex justify-center items-center gap-4 transition-transform ease-in-out duration-500 md:rounded-2xl p-6 md:p-0`}
			>
				{slides.map((slide, idx) => (
					<div
						key={idx}
						className={`${
							idx === activeImage
								? 'block w-full h-full object-cover transition-all duration-500 ease-in-out items-center '
								: 'hidden '
						}`}
					>
						{isAdmin && (
							<Link
								href={`/admin/slider/${slide?._id}`}
								className='absolute top-0 right-0 flex items-center justify-center'
							>
								<span className='cursor-pointer w-[30px] h-[30px] rounded-full bg-orange-600 flex justify-center items-center hover:opacity-80'>
									<FaPen size={12} color='white' />
								</span>
							</Link>
						)}
						{/* Render Image or React Component based on slide type */}
						{slide && typeof slide === 'object' && 'src' in slide ? (
							<Image
								src={slide.src}
								alt={slide.title}
								width={400}
								height={400}
								className='w-full h-[80vh] object-cover md:rounded-tl-3xl md:rounded-bl-3xl'
							/>
						) : (
							slide // Directly render ReactNode (like <Testimonials>)
						)}
					</div>
				))}
			</div>

			{/* Render Navigation Buttons if no DescriptionComponent is passed */}
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

			{/* Optionally render the DescriptionComponent */}
			{DescriptionComponent && (
				<DescriptionComponent
					activeImage={activeImage}
					clickNext={clickNext}
					clickPrev={clickPrev}
					slides={slides}
					testimonials
				/>
			)}
		</main>
	)
}

export default Slider
