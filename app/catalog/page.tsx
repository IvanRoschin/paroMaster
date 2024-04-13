import { ItemsList } from '../components'

type Props = {}

const page = (props: Props) => {
	return (
		<div>
			<h2 className='text-4xl mb-4 flex justify-start items-start'>Каталог товарів</h2>
			<ItemsList />
		</div>
	)
}

export default page
