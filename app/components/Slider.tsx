import { getAllSlides } from '@/actions/slider'
import { getAllTestimonials } from '@/actions/testimonials'
import useFetchData from 'app/hooks/useFetchData'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'
import EmptyState from './EmptyState'
import Loader from './Loader'
import Testimonial from './Testimonial'

interface SliderProps {
	searchParams?: any
	limit: number
	DescriptionComponent?: any
	testimonials?: boolean
}

const Slider: React.FC<SliderProps> = ({
	searchParams,
	limit,
	DescriptionComponent,
	testimonials = false,
}) => {
	const [activeImage, setActiveImage] = useState(0)

	const fetchFunction = testimonials ? getAllTestimonials : getAllSlides
	const { data, isLoading, isError } = useFetchData(
		searchParams,
		limit,
		fetchFunction,
		testimonials ? 'testimonials' : 'slides',
	)

	const slides = testimonials ? data?.testimonials : data?.slides

	useEffect(() => {
		const timer = setTimeout(() => {
			clickNext()
		}, 5000)

		return () => clearTimeout(timer)
	}, [activeImage, slides?.length])

	if (isLoading) {
		return <Loader />
	}

	if (isError) {
		return <div>Error fetching data.</div>
	}

	if (!slides || slides.length === 0) {
		return <EmptyState showReset />
	}

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

	return (
		<main
			className={`grid place-items-center ${
				testimonials ? 'grid-cols-1' : 'grid-cols-2'
			} w-full mx-auto max-w-5xl shadow-2xl rounded-2xl mt-[40px] relative mb-20`}
		>
			<div className='w-full flex justify-center items-center gap-4 transition-transform ease-in-out duration-500 md:rounded-2xl p-6 md:p-0'>
				{slides.map((slide: any, idx: number) => (
					<div
						key={idx}
						className={`${
							idx === activeImage
								? 'block w-full h-full object-cover transition-all duration-500 ease-in-out items-center'
								: 'hidden'
						}`}
					>
						{testimonials ? (
							<Testimonial
								key={idx}
								id={slide._id}
								name={slide.name}
								text={slide.text}
								stars={slide.rating}
							/>
						) : (
							<Image
								src={slide.src}
								alt={slide.title}
								width={400}
								height={400}
								className='w-full h-[80vh] object-cover md:rounded-tl-3xl md:rounded-bl-3xl'
							/>
						)}
					</div>
				))}
			</div>

			<div className='absolute md:bottom-1 bottom-10 right-10 md:right-0 w-full flex justify-center items-center'>
				<div className='absolute bottom-2 right-10 cursor-pointer' onClick={clickPrev}>
					<div className='swiper-button-prev'>
						<IoIosArrowDropleft />
					</div>
				</div>
				<div className='absolute bottom-2 right-2 cursor-pointer' onClick={clickNext}>
					<div className='swiper-button-next'>
						<IoIosArrowDropright />
					</div>
				</div>
			</div>

			{DescriptionComponent && (
				<DescriptionComponent
					activeImage={activeImage}
					clickNext={clickNext}
					clickPrev={clickPrev}
					slides={slides}
					testimonials={testimonials}
				/>
			)}
		</main>
	)
}

export default Slider
