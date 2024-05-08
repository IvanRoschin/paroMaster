'use client'

import { useShoppingCart } from 'app/context/ShoppingCartContext'
import { Icon } from '../Icon'

type Props = {}

const Cart = (props: Props) => {
	const { openCart, cartQuantity } = useShoppingCart()
	return (
		<div className='relative'>
			{cartQuantity > 0 && (
				<button onClick={openCart} className='flex items-center'>
					<Icon
						name='lucide/shopping-cart'
						className='w-8 h-8 cursor-pointer hover:text-primaryAccentColor focus:text-primaryAccentColor'
					/>
					<span
						className='			absolute
			-top-3
			-right-3
			p-[2px]
			bg-primaryAccentColor
			rounded-full
			text-[10px]
			text-white
			w-5
			h-5'
					>
						{cartQuantity}
					</span>
				</button>
			)}
		</div>
	)
}

export default Cart
