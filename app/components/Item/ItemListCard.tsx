'use client'

import { IGood } from '@/types/good/IGood'
import { useShoppingCart } from 'app/context/ShoppingCartContext'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Button from '../Button'

interface ItemListCardProps {
	item: IGood
}

const ItemListCard: React.FC<ItemListCardProps> = ({ item }) => {
	const [amount, setAmount] = useState(0)

	const {
		getItemQuantity,
		increaseCartQuantity,
		decreaseCartQuantity,
		removeFromCart,
	} = useShoppingCart()

	const quantity = getItemQuantity(item._id!)

	useEffect(() => {
		const newAmount = item.price * quantity
		setAmount(newAmount)
		localStorage.setItem(`amount-${item._id}`, JSON.stringify(newAmount))
	}, [item.price, item._id, quantity])

	return (
		<li className='flex flex-col justify-between border border-gray-300 rounded-md p-4 hover:shadow-[10px_10px_15px_-3px_rgba(0,0,0,0.3)] transition-all'>
			<Link href={`/item/${item._id}`} className='flex flex-col h-full justify-between'>
				<div>
					<div className='w-[200px] h-[200px]'>
						<Image
							src={item.imgUrl[0]}
							alt='item_photo'
							width={200}
							height={200}
							className='self-center mb-[30px]'
						/>
					</div>
					<h2 className='font-semibold mb-[20px]'>{item.title}</h2>
				</div>
				<div>
					<p className={`mb-[20px] ${item.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
						{item.isAvailable ? 'В наявності' : 'Немає в наявності'}
					</p>
					<p className='mb-[20px]'>Артикул: {item.vendor}</p>
					<p className='text-2xl font-bold mb-[20px]'>{item.price} грн</p>
				</div>
			</Link>
			<CartActions
				itemId={item._id!}
				quantity={quantity}
				increaseCartQuantity={increaseCartQuantity}
				decreaseCartQuantity={decreaseCartQuantity}
				removeFromCart={removeFromCart}
			/>
			{/* <ItemDetails item={item} /> */}
		</li>
	)
}

interface CartActionsProps {
	itemId: string
	quantity: number
	increaseCartQuantity: (id: string) => void
	decreaseCartQuantity: (id: string) => void
	removeFromCart: (id: string) => void
}

const CartActions: React.FC<CartActionsProps> = ({
	itemId,
	quantity,
	increaseCartQuantity,
	decreaseCartQuantity,
	removeFromCart,
}) => {
	return (
		<div>
			{quantity === 0 ? (
				<Button label='Купити' onClick={() => increaseCartQuantity(itemId)} />
			) : (
				<div className='flex items-center flex-col gap-10'>
					<div className='flex items-center justify-center gap-20'>
						<div className='flex items-center justify-between gap-2'>
							<Button label='-' onClick={() => decreaseCartQuantity(itemId)} small outline />
							<span className='text-xl'>{quantity}</span>в корзині
							<Button label='+' onClick={() => increaseCartQuantity(itemId)} small outline />
						</div>
					</div>
					<Button
						label='Видалити'
						onClick={() => {
							removeFromCart(itemId)
							localStorage.removeItem(`amount-${itemId}`)
						}}
					/>
				</div>
			)}
		</div>
	)
}

interface ItemDetailsProps {
	item: IGood
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item }) => {
	return (
		<>
			<p className='font-light text-gray-500'>
				Сумісність з брендами: {item.isCompatible ? 'так' : 'ні'}
			</p>
			<p className='font-light text-gray-500'>Brand: {item.brand}</p>
			<p className='font-light text-gray-500'>Model: {item.model}</p>
			<p className='font-light text-gray-500'>Сумісність з брендами: {item.compatibility}</p>
		</>
	)
}

export default ItemListCard
