'use client'

import { getGoodById } from '@/actions/goods'
import { SGood } from '@/types/good/IGood'
import { useShoppingCart } from 'app/context/ShoppingCartContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Button from '../Button'
import { Icon } from '../Icon'
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
	const [amount, setAmount] = useState(0)

	useEffect(() => {
		if (data) {
			const good: SGood = data
			const newAmount = good.price * quantity
			setAmount(newAmount)
			localStorage.setItem(`amount-${id}`, JSON.stringify(newAmount))
		}
	}, [data, id, quantity])

	if (error) {
		console.error('Error fetching good:', error)
		return <p>Error loading item.</p>
	}

	if (!data) {
		return <Loader />
	}

	const good: SGood = data

	return (
		<div>
			<li className='relative flex flex-col justify-between border border-gray-300 rounded-md p-4 hover:shadow-[10px_10px_15px_-3px_rgba(0,0,0,0.3)] transition-all mb-4'>
				<div className='flex items-center justify-center gap-10'>
					<div className='w-[150px] '>
						<Image
							src={good.src[0]}
							alt='item_photo'
							width={150}
							height={150}
							className='self-center flex items-center justify-center'
						/>
					</div>
					<p className='text-md'>{good.title}</p>
					<div className='flex items-center flex-col gap-5'>
						<div className='flex items-center justify-center gap-5'>
							{/* Quantity controls with buttons */}
							<div className='flex items-center justify-between gap-2'>
								<Button
									label='-'
									onClick={() => {
										decreaseCartQuantity(good._id)
									}}
									small
									outline
								/>
								<span className='text-xl'>{quantity}</span>
								<Button label='+' onClick={() => increaseCartQuantity(good._id)} small outline />
							</div>{' '}
							x <p>{good.price}</p>
						</div>
					</div>
					<span>=</span>
					{/* Calculated total price for the quantity */}
					<p> {amount}</p>
					{/* Button to remove item from cart */}
					<button
						onClick={() => {
							removeFromCart(good._id)
							localStorage.removeItem(`amount-${id}`)
						}}
					>
						<Icon name='icon_trash' className='w-5 h-5 mr-1 hover:text-primaryAccentColor' />
					</button>
				</div>
			</li>
		</div>
	)
}

export default CartItem
