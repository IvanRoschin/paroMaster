import { getAllGoods } from '@/actions/getTest'
import { ISearchParams } from '@/types/searchParams'
import { IItem } from 'types/item/IItem'
import { ItemListCard } from '.'

const ItemsList = async (searchParams: { searchParams: ISearchParams }) => {
	const goods = await getAllGoods(searchParams)

	if (goods?.length === 0) {
		return <h2 className='text-4xl mb-4'>Товар не знайдений</h2>
	}

	return (
		<ul className='grid grid-cols-4 gap-4'>
			{goods?.map((item: IItem) => (
				<ItemListCard key={item._id} item={item} />
			))}
		</ul>
	)
}

export default ItemsList
