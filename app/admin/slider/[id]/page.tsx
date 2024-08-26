import { getSlideById, updateSlide } from '@/actions/slider'
import { AddSlideForm } from '@/components/index'

interface Params {
	id: string
}
const SingleSlidePage = async ({ params }: { params: Params }) => {
	const { id } = params
	const slide = await getSlideById(id)
	return (
		<div className='mb-20'>
			<AddSlideForm title={'Редагувати слайд'} slide={slide} action={updateSlide} />
		</div>
	)
}

export default SingleSlidePage
