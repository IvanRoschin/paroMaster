import CartModal from '../modals/CartModal'
import OrderModal from '../modals/OrderModal'

export function ShoppingCart({
	isOpen,
	isOrderModalOpen,
}: {
	isOpen: boolean
	isOrderModalOpen: boolean
}) {
	return (
		<>
			<CartModal isOpen={isOpen} />
			<OrderModal isOrderModalOpen={isOrderModalOpen} />
		</>
	)
}

export default ShoppingCart
