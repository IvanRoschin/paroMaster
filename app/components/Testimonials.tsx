import React from 'react'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import Slider from './Slider'

interface TestimonialProps {
	name: string
	text: string
	stars: number
}

const testimonialItems: TestimonialProps[] = [
	{
		name: 'Матвій',
		text: 'Після замовлення послуги термінового ремонту задоволений якістю та швідкістю ремонту.',
		stars: 5,
	},
	{
		name: 'Андрій',
		text: 'Ідеально в мойому випадку',
		stars: 4,
	},
	{
		name: 'Папа Карло',
		text: 'Все вийшло навіть краще ніж я очікував! Велике дякую!',
		stars: 5,
	},
	{
		name: 'Марина',
		text: 'Дуже чудові парогенератори! Якістю задоволена',
		stars: 4,
	},
	{
		name: 'Алекс',
		text: 'Можу спокійно рекомендувати!',
		stars: 5,
	},
	{
		name: 'Сергій',
		text: 'Задоволений результатом.',
		stars: 4,
	},
]

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
		<div
			className=' rounded-lg p-10 pr-10 m-4 w-full h-[150px] mx-2 grid 
				place-items-center 
				md:grid-cols-2
				grid-cols-1
				'
		>
			<div>
				<div className='text-xl font-semibold'>{name}</div>
				<div className='flex items-center'>{renderStars(stars)}</div>
			</div>
			<p className='text-gray-600'>{text}</p>
		</div>
	)
}

const TestimonialsList: React.FC = () => {
	return (
		<div className='flex flex-wrap justify-center'>
			<Slider
				slides={testimonialItems.map((testimonial, index) => (
					<Testimonials
						key={index}
						name={testimonial.name}
						text={testimonial.text}
						stars={testimonial.stars}
					/>
				))}
			/>
		</div>
	)
}

export default TestimonialsList
