import { ITestimonial } from '@/types/index'
import React from 'react'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import Slider from './Slider'

interface TestimonialProps {
	name: string
	text: string
	stars: number
}

const Testimonials: React.FC<TestimonialProps> = ({ name, text, stars }) => {
	const renderStars = (rating: number) => {
		const fullStars = Math.floor(rating)
		const halfStars = rating % 1 >= 0.5 ? 1 : 0
		const emptyStars = 5 - fullStars - halfStars

		return (
			<>
				{Array(fullStars)
					.fill(0)
					.map((_, index) => (
						<FaStar key={index} className='text-yellow-400' />
					))}
				{Array(halfStars)
					.fill(0)
					.map((_, index) => (
						<FaStarHalfAlt key={index} className='text-yellow-400' />
					))}
				{Array(emptyStars)
					.fill(0)
					.map((_, index) => (
						<FaRegStar key={index} className='text-yellow-400' />
					))}
			</>
		)
	}

	return (
		<div className='rounded-lg p-10 pr-10 m-4 w-full h-[150px] mx-2 grid place-items-center md:grid-cols-2 grid-cols-1'>
			<div>
				<div className='text-xl font-semibold'>{name}</div>
				<div className='flex items-center'>{renderStars(stars)}</div>
			</div>
			<p className='text-gray-600'>{text}</p>
		</div>
	)
}

interface TestimonialsListProps {
	testimonials: ITestimonial[]
}

const TestimonialsList: React.FC<TestimonialsListProps> = ({ testimonials }) => {
	return (
		<div className='flex flex-wrap justify-center'>
			<Slider
				slides={testimonials.map((testimonial, index) => (
					<Testimonials
						key={index}
						name={testimonial.name}
						text={testimonial.text}
						stars={testimonial.rating}
					/>
				))}
			/>
		</div>
	)
}

export default TestimonialsList
