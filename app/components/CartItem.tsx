'use client'

import { getGoodById } from '@/actions/getTest'
import useSWR from 'swr'

type CartItemProps = {
	item: { id: string; quantity: number }
}

const CartItem = (item: CartItemProps) => {
	const { data: good, error } = useSWR('good', () => {
		console.log('item.item.id', item.item.id)
		if (item.item.id) getGoodById(item.item.id)
	})
	console.log('good', good)
	if (good == null) return null

	// const { removeFromCart, increaseCartQuantity, decreaseCartQuantity } = useShoppingCart()

	// const good = goods?.find(i => i._id === id)
	// if (good == null) return null

	// console.log('good', good)

	// const plainGood = {
	// 	_id: good._id?.toString() ?? '',
	// 	category: good.category,
	// 	imgUrl: good.imgUrl,
	// 	brand: good.brand,
	// 	model: good.model,
	// 	vendor: good.vendor,
	// 	title: good.title,
	// 	description: good.description,
	// 	price: good.price,
	// 	isAvailable: good.isAvailable,
	// 	isCompatible: good.isCompatible,
	// 	compatibility: good.compatibility,
	// }

	return (
		<div>
			<p>Item</p>
			<li className='flex flex-col justify-between border border-gray-300 rounded-md p-4 hover:shadow-[10px_10px_15px_-3px_rgba(0,0,0,0.3)] transition-all'>
				<p>CartItem</p>
				{/* <p>{good.title}</p> */}
			</li>
		</div>
	)
}
export default CartItem
