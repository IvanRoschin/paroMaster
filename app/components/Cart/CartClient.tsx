'use client'

import CartItem from '@/components/Cart/CartItem'
import { useShoppingCart } from 'app/context/ShoppingCartContext'
import { useEffect, useState } from 'react'

type Props = {}

export const CartClient = (props: Props) => {
	const { cartItems } = useShoppingCart()
	const [amounts, setAmounts] = useState<number[]>([])

	useEffect(() => {
		const retrievedAmounts = cartItems.map(item => {
			const storedAmount = localStorage.getItem(`amount-${item.id}`)
			return storedAmount ? JSON.parse(storedAmount) : 0
		})
		setAmounts(retrievedAmounts)
	}, [cartItems])

	const totalAmount = amounts.reduce((total, amount) => total + amount, 0)

	return (
		<div>
			<h2 className='text-2xl pb-4'>Товари у замовленні</h2>
			{cartItems.map(item => (
				<CartItem key={item.id} id={item.id} quantity={item.quantity} />
			))}
			<p className='text-end pt-10'>
				Всього за замовленням: <span className='font-bold'>{totalAmount} грн.</span>
			</p>
		</div>
	)
}

export default CartClient
