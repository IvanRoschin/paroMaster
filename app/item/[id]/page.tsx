'use client'
import { getGoodById } from '@/actions/goods'
import Button from '@/components/Button'
import ImagesBlock from '@/components/ImagesBlock'
import Loader from '@/components/Loader'
import { IItem } from '@/types/item/IItem'
import { useShoppingCart } from 'app/context/ShoppingCartContext'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function Item({ params }: { params: any }) {
	const [amount, setAmount] = useState(0)

	const {
		getItemQuantity,
		increaseCartQuantity,
		decreaseCartQuantity,
		removeFromCart,
	} = useShoppingCart()

	const { data, error } = useSWR(`good-${params.id}`, () => getGoodById(params.id))

	useEffect(() => {
		if (data) {
			const item = JSON.parse(data)
			const newAmount = item.price * getItemQuantity(item._id)
			setAmount(newAmount)
			localStorage.setItem(`amount-${item._id}`, JSON.stringify(newAmount))
		}
	}, [data, getItemQuantity])

	if (error) {
		console.error('Error fetching good:', error)
		return <div>Error loading item. Please try again later.</div>
	}

	if (!data) {
		return <Loader />
	}

	const item = JSON.parse(data)
	const quantity = getItemQuantity(item._id)

	return (
		<div className='flex'>
			<ImagesBlock item={item} />
			<div className='pt-10'>
				<h2 className='font-semibold text-2xl mb-[40px]'>{item.title}</h2>
				<p className='mb-[20px]'>{item.description}</p>
				<p className={`mb-[30px] ${item.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
					{item.isAvailable ? 'В наявності' : 'Немає в наявності'}
				</p>
				<p className='mb-[20px]'>Артикул: {item.vendor}</p>
				<p className='text-2xl font-bold mb-[30px]'>{item.price} грн</p>
				<div>
					{quantity === 0 ? (
						<Button label='Купити' onClick={() => increaseCartQuantity(item._id)} />
					) : (
						<div className='flex items-center flex-col gap-10'>
							<div className='flex items-center justify-center gap-20'>
								<div className='flex items-center justify-between gap-2'>
									<Button label='-' onClick={() => decreaseCartQuantity(item._id)} small outline />
									<span className='text-xl'>{quantity}</span> в корзині
									<Button label='+' onClick={() => increaseCartQuantity(item._id)} small outline />
								</div>
							</div>
							<Button
								label='Видалити'
								onClick={() => {
									removeFromCart(item._id)
									localStorage.removeItem(`amount-${item._id}`)
								}}
							/>
						</div>
					)}
				</div>
				<ItemDetails item={item} />
			</div>
		</div>
	)
}

function ItemDetails({ item }: { item: IItem }) {
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
