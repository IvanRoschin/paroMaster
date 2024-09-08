import { ISearchParams } from '@/types/index'
import Slider from './Slider'

const TestimonialsList = ({
	searchParams,
	limit,
}: {
	searchParams: ISearchParams
	limit: number
}) => {
	return (
		<div className='flex flex-wrap justify-center'>
			<Slider searchParams={searchParams} limit={limit} testimonials />
		</div>
	)
}

export default TestimonialsList
