import { Icon } from './Icon'

type Props = {}

const Cart = (props: Props) => {
	return (
		<div>
			<Icon name='lucide/shopping-cart' className=' w-8 h-8 hover:text-primaryAccentColor' />
		</div>
	)
}

export default Cart
