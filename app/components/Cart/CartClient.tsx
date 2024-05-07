'use client'

import CartItem from '@/components/Cart/CartItem'
import { useShoppingCart } from 'app/context/ShoppingCartContext'

type Props = {}

export const CartClient = (props: Props) => {
	const { cartItems } = useShoppingCart()
	return (
		<div>
			<h2 className='text-2xl mb-4'>Товари у замовленні</h2>
			{cartItems.map(item => {
				return <CartItem key={item.id} id={item.id} quantity={item.quantity} />
			})}
		</div>
	)
}
