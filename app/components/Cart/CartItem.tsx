'use client'

import { getGoodById } from '@/actions/getTest'
import useSWR from 'swr'
import Loader from '../Loader'

type CartItemProps = {
	id: string
	quantity: number
}

const CartItem: React.FC<CartItemProps> = ({ id, quantity }) => {
	const { data: good, error } = useSWR(`good-${id}`, () => getGoodById(id))
	if (error) {
		console.error('Error fetching good:', error)
	}
	if (!good) {
		return <Loader />
	}

	return (
		<div>
			<li className='flex flex-col justify-between border border-gray-300 rounded-md p-4 hover:shadow-[10px_10px_15px_-3px_rgba(0,0,0,0.3)] transition-all'>
				<p>{good.title}</p>
				<p>Кількість: {quantity}</p>
				{/* Add more item details here (e.g., price, image, etc.) */}
			</li>
		</div>
	)
}
export default CartItem
