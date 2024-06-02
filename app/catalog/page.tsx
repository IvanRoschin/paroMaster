import { getAllGoods } from '@/actions/getTest'
import { ISearchParams } from '@/types/searchParams'
import { ItemsList } from '../components'

type Props = {}

export default async function catalogPage({ searchParams }: { searchParams: ISearchParams }) {
	const goods = await getAllGoods(searchParams)

	let newArray = ''

	if (goods) {
		newArray = JSON.stringify(goods)
	}
	return (
		<div>
			<h2 className='text-4xl mb-4 flex justify-start items-start'>Каталог товарів</h2>
			<ItemsList goods={newArray} />
		</div>
	)
}
