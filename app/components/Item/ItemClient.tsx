'use client'

import { getGoodById } from '@/actions/getTest'
import { Icon } from '@/components/Icon'
import { SItem } from '@/types/item/IItem'
import { useShoppingCart } from 'app/context/ShoppingCartContext'
import useSWR from 'swr'
import ImagesBlock from '../ImagesBlock'
import Loader from '../Loader'

export default function ItemClient({ id }: { id: string }) {
	const {
		getItemQuantity,
		increaseCartQuantity,
		decreaseCartQuantity,
		removeFromCart,
	} = useShoppingCart()
	const { data, error } = useSWR(id ? 'data' : null, () => getGoodById(id))

	if (error) {
		console.error('Error fetching item:', error)
	}
	if (!data) {
		return <Loader />
	}

	const item: SItem = JSON.parse(data)

	const quantity = getItemQuantity(item._id)

	return (
		item && (
			<div className='flex'>
				<ImagesBlock item={item} />
				<div className='pt-10'>
					<h2 className='font-semibold text-2xl mb-[40px]'>{item.title}</h2>
					<p className='mb-[20px]'>{item.description}</p>
					{item.isAvailable ? (
						<p className='text-green-600 mb-[30px]'>В наявності</p>
					) : (
						<p className='text-red-600 mb-[30px]'>Немає в наявності</p>
					)}
					<p className='mb-[20px]'>Артикул: {item.vendor}</p>
					<p className='text-2xl font-bold mb-[30px]'>{item.price} грн</p>
					<div>
						<div>
							{quantity === 0 ? (
								<button
									type='button'
									className='p-4 w-full mb-[20px] bg-orange-600 hover:bg-orange-700 focus:bg-orange-700 text-white transition-all font-semibold text-lg
									rounded-md'
									onClick={() => increaseCartQuantity(item._id)}
								>
									Купити
								</button>
							) : (
								<div className='flex flex-col items-center justify-center'>
									<div className='flex items-center justify-center'>
										<button
											className='w-[20px] mb-[10px] mr-[10px] bg-orange-600 hover:bg-orange-700 focus:bg-orange-700 text-white transition-all text-lg rounded-md'
											onClick={() => decreaseCartQuantity(item._id)}
										>
											-
										</button>
										<div>
											<span className='text-2xl'>{quantity}</span> в корзині
										</div>{' '}
										<button
											className='w-[20px] mb-[10px] ml-[10px] bg-orange-600 hover:bg-orange-700 focus:bg-orange-700 text-white transition-all text-lg rounded-md'
											onClick={() => increaseCartQuantity(item._id)}
										>
											+
										</button>
									</div>
									<button
										className='
										flex 
										items-center 
										justify-center
										w-[50%] mb-[10px] mr-[10px] bg-red-600 hover:bg-red-700 focus:bg-red-700 text-white transition-all text-sm rounded-md py-2 px-3'
										onClick={() => removeFromCart(item._id)}
									>
										<Icon
											name='icon_trash'
											className='
											w-5 
											h-5 
											text-white 
											hover:text-primaryAccentColor'
										/>
										Видалити{' '}
									</button>
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
					<p className='font-light text-gray-500'>
						Сумісність з моделями: {item.compatibility.join(', ')}
					</p>
				</div>
			</div>
		)
	)
}
