'use client'

import { getGoodById } from '@/actions/goods'
import Button from '@/components/Button'
import ImagesBlock from '@/components/ImagesBlock'
import Loader from '@/components/Loader'
import { useFetchDataById } from '@/hooks/useFetchDataById'
import { IGood } from '@/types/index'
import { useShoppingCart } from 'app/context/ShoppingCartContext'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaPen } from 'react-icons/fa'

export default function Item({ params }: { params: any }) {
	const { data: session } = useSession()

	const isAdmin = session?.user
	const [amount, setAmount] = useState(0)

	const {
		getItemQuantity,
		increaseCartQuantity,
		decreaseCartQuantity,
		removeFromCart,
	} = useShoppingCart()

	const { data, isLoading, isError, error } = useFetchDataById(params.id, getGoodById, 'good')

	useEffect(() => {
		if (data) {
			const newAmount = data.price * getItemQuantity(data._id)
			setAmount(newAmount)
			localStorage.setItem(`amount-${data._id}`, JSON.stringify(newAmount))
		}
	}, [data, getItemQuantity])

	if (isLoading) return <Loader />
	if (isError) {
		return (
			<div>
				Error fetching good data: {error instanceof Error ? error.message : 'Unknown error'}
			</div>
		)
	}

	if (!data) return <Loader />

	const quantity = getItemQuantity(data._id)

	return (
		<div className='flex flex-col lg:flex-row mb-4 lg:mb-0'>
			<ImagesBlock item={data} />
			<div className='pt-10 relative'>
				{isAdmin && (
					<Link
						href={`/admin/goods/${data._id}`}
						className='absolute top-0 right-0 flex items-center justify-center'
					>
						<span className='cursor-pointer w-[30px] h-[30px] rounded-full bg-orange-600 flex justify-center items-center hover:opacity-80'>
							<FaPen size={12} color='white' />
						</span>
					</Link>
				)}
				<h2 className='font-semibold text-2xl mb-[40px]'>{data.title}</h2>
				<p className='mb-[20px]'>{data.description}</p>
				<p className={`mb-[30px] ${data.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
					{data.isAvailable ? 'В наявності' : 'Немає в наявності'}
				</p>
				<p className='mb-[20px]'>Артикул: {data.vendor}</p>
				<p className='text-2xl font-bold mb-[30px]'>{data.price} грн</p>
				<div className='mb-4'>
					{quantity === 0 ? (
						<Button
							width='40'
							type='button'
							label='Купити'
							onClick={() => increaseCartQuantity(data._id)}
							disabled={!data.isAvailable}
						/>
					) : (
						<div className='flex items-center flex-col gap-10'>
							<div className='flex items-center justify-center gap-20'>
								<div className='flex items-center justify-between gap-2'>
									<Button
										width='40'
										type='button'
										label='-'
										onClick={() => decreaseCartQuantity(data._id)}
										small
										outline
									/>
									<span className='text-xl'>{quantity}</span> в корзині
									<Button
										width='40'
										type='button'
										label='+'
										onClick={() => increaseCartQuantity(data._id)}
										small
										outline
									/>
								</div>
							</div>
							<Button
								width='40'
								type='button'
								label='Видалити'
								disabled={data.isAvailable === 'false'}
								onClick={() => {
									removeFromCart(data._id)
									localStorage.removeItem(`amount-${data._id}`)
								}}
							/>
						</div>
					)}
				</div>
				<ItemDetails item={data} />
			</div>
		</div>
	)
}

function ItemDetails({ item }: { item: IGood }) {
	return (
		<>
			<p className='font-light text-gray-500'>
				Сумісність з брендами: <span className='font-bold'>{item.isCompatible ? 'так' : 'ні'}</span>
			</p>
			<p className='font-light text-gray-500'>
				Brand: <span className='font-bold'> {item.brand}</span>
			</p>
			<p className='font-light text-gray-500'>
				Model: <span className='font-bold'>{item.model}</span>{' '}
			</p>
			<p className='font-light text-gray-500'>
				Сумісність з брендами: <span className='font-bold'>{item.compatibility}</span>
			</p>
		</>
	)
}
