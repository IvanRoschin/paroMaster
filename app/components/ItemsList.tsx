import { getAllGoods } from '@/actions/getTest'
import { ISearchParams } from '@/types/searchParams'
import { IItem } from 'types/item/IItem'
import { ItemListCard } from '.'

const ItemsList = async (props: ISearchParams) => {
	const searchParams = props?.searchParams

	const goods = await getAllGoods(searchParams)

	if (!goods) {
		return <p>Товар не знайдений</p>
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
