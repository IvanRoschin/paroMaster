'use client'

import { useShoppingCart } from 'app/context/ShoppingCartContext'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../Button'

interface ItemListCardProps {
	item: {
		_id: string
		category: string
		imgUrl: string[]
		brand: string
		model: string
		vendor: string
		title: string
		description: string
		price: number
		isAvailable: boolean
		isCompatible: boolean
		compatibility: string[]
	}
}
const ItemListCard = ({ item }: ItemListCardProps) => {
	const {
		getItemQuantity,
		increaseCartQuantity,
		decreaseCartQuantity,
		removeFromCart,
	} = useShoppingCart()

	const quantity = getItemQuantity(item._id)
	return (
		<li className='flex flex-col justify-between border border-gray-300 rounded-md p-4 hover:shadow-[10px_10px_15px_-3px_rgba(0,0,0,0.3)] transition-all'>
			<Link href={`/item/${item._id}`} className='flex flex-col h-full justify-between'>
				<div>
					<div className='w-[210px] h-[210px]'>
						<Image
							src={item.imgUrl[0]}
							alt='item_photo'
							width={210}
							height={210}
							className='self-center mb-[30px]'
						/>
					</div>
					<h2 className='font-semibold mb-[20px]'>{item.title}</h2>
				</div>
				<div>
					{item.isAvailable ? (
						<p className='text-green-600 mb-[20px]'>В наявності</p>
					) : (
						<p className='text-red-600 mb-[20px]'>Немає в наявності</p>
					)}
					<p className='mb-[20px]'>Артикул: {item.vendor}</p>
					<p className='text-2xl font-bold mb-[20px]'>{item.price} грн</p>
				</div>
			</Link>
			<div>
				<div>
					{quantity === 0 ? (
						<Button label='Купити' onClick={() => increaseCartQuantity(item._id)} />
					) : (
						<div className='flex items-center flex-col gap-10'>
							<div className='flex items-center justify-center gap-20'>
								<div className='flex items-center justify-between gap-2'>
									<Button label='-' onClick={() => decreaseCartQuantity(item._id)} small outline />
									<span className='text-xl'>{quantity}</span>корзина
									<Button label='+' onClick={() => increaseCartQuantity(item._id)} small outline />
								</div>
							</div>
							<Button label='Видалити' onClick={() => removeFromCart(item._id)} />
						</div>
					)}
				</div>

				<p className='font-light text-gray-500'>
					Сумісність з брендами: {item.isCompatible ? 'так' : 'ні'}
				</p>
				<p className='font-light text-gray-500'>Brand: {item.brand}</p>
				<p className='font-light text-gray-500'>Model: {item.model}</p>
				<p className='font-light text-gray-500'>Сумісність з брендами: {item.compatibility}</p>
			</div>
		</li>
	)
}

export default ItemListCard
