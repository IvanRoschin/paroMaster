import { ITestimonial } from '@/types/index'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { FaPen, FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import Slider from './Slider'

interface TestimonialProps {
	id: string
	name: string
	text: string
	stars: number
}

const Testimonials: React.FC<TestimonialProps> = ({ id, name, text, stars }) => {
	const { data: session } = useSession()

	const isAdmin = session?.user

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
		<>
			{isAdmin && (
				<Link
					href={`/admin/testimonials/${id}`}
					className='absolute top-0 right-0 flex items-center justify-center'
				>
					<span className='cursor-pointer w-[30px] h-[30px] rounded-full bg-orange-600 flex justify-center items-center hover:opacity-80'>
						<FaPen size={12} color='white' />
					</span>
				</Link>
			)}
			<div className='rounded-lg p-10 pr-10 m-4 w-full h-[150px] mx-2 grid place-items-center md:grid-cols-2 grid-cols-1'>
				<div>
					<div className='text-xl font-semibold'>{name}</div>
					<div className='flex items-center'>{renderStars(stars)}</div>
				</div>
				<p className='text-gray-600'>{text}</p>
			</div>
		</>
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
						id={testimonial._id}
						name={testimonial.name}
						text={testimonial.text}
						stars={testimonial.rating}
					/>
				))}
				testimonials
			/>
		</div>
	)
}

export default TestimonialsList
