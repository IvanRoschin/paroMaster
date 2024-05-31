'use client'

import { getGoodById } from '@/actions/getTest'
import { SItem } from '@/types/item/IItem'
import { useShoppingCart } from 'app/context/ShoppingCartContext'
import Image from 'next/image'
import { IoMdClose } from 'react-icons/io'
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
				<div className='flex items-center justify-center gap-10'>
					<div className='w-[125px] h-[125px]'>
						{/* Displaying an image using the `Image` component */}
						<Image
							src={good.imgUrl[0]}
							alt='item_photo'
							width={125}
							height={125}
							className='self-center mb-[30px]'
						/>
					</div>
					<p>{good.title}</p>
					<div className='flex items-center flex-col gap-10'>
						<div className='flex items-center justify-center gap-20'>
							{/* Quantity controls with buttons */}
							<div className='flex items-center justify-between gap-2'>
								<Button label='-' onClick={() => decreaseCartQuantity(good._id)} small outline />
								<span className='text-xl'>{quantity}</span>
								<Button label='+' onClick={() => increaseCartQuantity(good._id)} small outline />
							</div>{' '}
							x <p>{good.price} грн.</p>
						</div>
					</div>{' '}
					{/* Calculated total price for the quantity */}
					<p>{good.price * quantity} грн.</p>
					{/* Button to remove item from cart */}
					<button
						onClick={() => removeFromCart(good._id)}
						className='
            p-1 
            border-[1px] 
            rounded-full 
            border-neutral-600 
            hover:opacity-70 
            transition 
            absolute 
            right-9
            hover:border-primaryAccentColor
          '
					>
						<IoMdClose size={18} />
					</button>
				</div>
			</li>
		</div>
	)
}
export default CartItem
