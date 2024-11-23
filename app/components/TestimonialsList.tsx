import { IGetAllTestimonials } from '@/actions/testimonials'
import Slider from './Slider'

const TestimonialsList = ({ testimonialsData }: { testimonialsData: IGetAllTestimonials }) => {
	return (
		<div className='flex flex-wrap justify-center'>
			<Slider testimonialsData={testimonialsData} testimonials />
		</div>
	)
}

export default TestimonialsList
