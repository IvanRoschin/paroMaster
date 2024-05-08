'use client'

import { getGoodById } from '@/actions/getTest'
import { SItem } from '@/types/item/IItem'
import { useShoppingCart } from 'app/context/ShoppingCartContext'
import Image from 'next/image'
import useSWR from 'swr'
import Button from '../Button'
import Loader from '../Loader'

type CartItemProps = {
	id: string
	quantity: number
}

const CartItem: React.FC<CartItemProps> = ({ id, quantity }) => {
	const {
		getItemQuantity,
		increaseCartQuantity,
		decreaseCartQuantity,
		removeFromCart,
	} = useShoppingCart()

	const { data, error } = useSWR(`data-${id}`, () => getGoodById(id))
	if (error) {
		console.error('Error fetching good:', error)
	}
	if (!data) {
		return <Loader />
	}

	const good: SItem = JSON.parse(data)

	return (
		<div>
			<li className='flex flex-col justify-between border border-gray-300 rounded-md p-4 hover:shadow-[10px_10px_15px_-3px_rgba(0,0,0,0.3)] transition-all'>
				<div className='flex items-center justify-center'>
					<div className='w-[50px] h-[50px]'>
						<Image
							src={good.imgUrl[0]}
							alt='item_photo'
							width={50}
							height={50}
							className='self-center mb-[30px]'
						/>
					</div>
					<p>{good.title}</p>
					<div className='flex items-center flex-col gap-10'>
						<div className='flex items-center justify-center gap-20'>
							<div className='flex items-center justify-between gap-2'>
								<Button label='-' onClick={() => decreaseCartQuantity(good._id)} small outline />
								<span className='text-xl'>{quantity}</span>
								<Button label='+' onClick={() => increaseCartQuantity(good._id)} small outline />
							</div>
						</div>
						<Button label='Видалити' onClick={() => removeFromCart(good._id)} />
					</div>{' '}
				</div>
				<p>{good.price} грн.</p>

				{/* Add more item details here (e.g., price, image, etc.) */}
			</li>
		</div>
	)
}
export default CartItem
