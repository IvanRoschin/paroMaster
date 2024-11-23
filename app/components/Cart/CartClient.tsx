'use client'

import { useShoppingCart } from 'app/context/ShoppingCartContext'
import { useEffect, useState } from 'react'
import CartItem from './CartItem'

type Props = {}

export const CartClient = (props: Props) => {
	const { cartItemsId } = useShoppingCart()
	const [amounts, setAmounts] = useState<number[]>([])

	useEffect(() => {
		const retrievedAmounts = cartItemsId.map(item => {
			const storedAmount = localStorage.getItem(`amount-${item.id}`)
			return storedAmount ? JSON.parse(storedAmount) : 0
		})
		setAmounts(retrievedAmounts)
	}, [cartItemsId])

	const totalAmount = amounts.reduce((total, amount) => total + amount, 0)

	return (
		<div>
			<h2 className='text-2xl'>Товари у замовленні</h2>
			{cartItemsId.map(item => (
				<CartItem key={item.id} id={item.id} quantity={item.quantity} />
			))}
			<p className='text-end pt-10'>
				Всього за замовленням: <span className='font-bold'>{totalAmount} грн.</span>
				<br />+ вартість доставки: <span className='font-bold'> за тарифами перевізника</span>
			</p>
		</div>
	)
}

export default CartClient
