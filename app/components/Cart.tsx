import { Icon } from './Icon'

type Props = {}

const Cart = (props: Props) => {
	return (
		<div>
			<Icon name='lucide/shopping-cart' className=' w-4 h-4 hover:text-orange-400' />
		</div>
	)
}

export default Cart
