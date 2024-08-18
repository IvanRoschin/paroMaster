import { getCategoryById, updateCategory } from '@/actions/categories'
import AddCategoryForm from '@/components/admin/AddCategoryForm'

interface Params {
	id: string
}
const SingleCategoryPage = async ({ params }: { params: Params }) => {
	const { id } = params
	const category = await getCategoryById(id)
	return (
		<div className='mb-20'>
			<AddCategoryForm title={'Редагувати категорію'} category={category} action={updateCategory} />
		</div>
	)
}

export default SingleCategoryPage
