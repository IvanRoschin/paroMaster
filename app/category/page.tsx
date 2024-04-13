import { ISearchParams } from '@/types/searchParams'
import { ItemsList } from '../components'

const page = ({ searchParams }: { searchParams: ISearchParams }) => {
	return (
		<div>
			<h2 className='text-4xl mb-4'>{searchParams?.category}</h2>
			<ItemsList searchParams={searchParams} />
		</div>
	)
}

export default page
