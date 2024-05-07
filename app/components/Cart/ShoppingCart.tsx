import CartModal from '../modals/CartModal'

type Props = {}

export function ShoppingCart({ isOpen }: { isOpen: boolean }) {
	return <CartModal isOpen={isOpen} />
}

export default ShoppingCart
