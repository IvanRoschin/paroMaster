import { addGood } from '@/actions/goods'
import { AddGoodForm } from '@/components/index'

const AddGoodPage = () => {
	return (
		<div className='mb-20'>
			<AddGoodForm title='Додати новий товар' action={addGood} />
		</div>
	)
}

export default AddGoodPage
