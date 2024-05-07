'use client'

import CartItem from '@/components/CartItem'
import { useShoppingCart } from 'app/context/ShoppingCartContext'

type Props = {}

export const CartClient = (props: Props) => {
	const { cartItems } = useShoppingCart()
	return (
		<div>
			<h2 className='text-4xl mb-4'>Корзина товарів</h2>
			{cartItems.map(item => {
				return (
					<CartItem
						key={item.id}
						item={{
							id: item.id,
							quantity: item.quantity,
						}}
					/>
				)
			})}
			{/* <ItemsList goods={cartItems} /> */}
		</div>
	)
}
