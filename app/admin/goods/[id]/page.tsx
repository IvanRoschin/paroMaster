import { getGoodById, updateGood } from '@/actions/goods'
import { AddGoodForm } from '@/components/index'

interface Params {
	id: string
}
const SingleGoodPage = async ({ params }: { params: Params }) => {
	const { id } = params
	const good = await getGoodById(id)

	return (
		<div className='mb-20'>
			<AddGoodForm title={'Редагувати дані про товар'} good={good} action={updateGood} />
		</div>
	)
}

export default SingleGoodPage
