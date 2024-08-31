import { addCategory } from '@/actions/categories'
import { AddCategoryForm } from '@/components/index'

const AddCategoryPage = () => {
	return (
		<div className='mb-20'>
			<AddCategoryForm title='Додати нову категорію' action={addCategory} />
		</div>
	)
}

export default AddCategoryPage
