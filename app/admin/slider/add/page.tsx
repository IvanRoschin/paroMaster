import { addSlide } from '@/actions/slider'
import { AddSlideForm } from '@/components/index'

const AddSlidePage = () => {
	return (
		<div className='mb-20'>
			<AddSlideForm title='Додати новий слайд' action={addSlide} />
		</div>
	)
}

export default AddSlidePage
