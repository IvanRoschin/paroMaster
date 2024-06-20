import { useShoppingCart } from 'app/context/ShoppingCartContext'
import React from 'react'
import OrderForm from '../OrderForm'
import Modal from './Modal'

interface OrderModalProps {
	isOrderModalOpen: boolean
}

const OrderModal: React.FC<OrderModalProps> = ({ isOrderModalOpen }) => {
	const { closeOrderModal, resetCart } = useShoppingCart()

	const bodyContent = (
		<div className='flex flex-col gap-4'>
			<OrderForm closeOrderModal={closeOrderModal} resetCart={resetCart} />
		</div>
	)

	const footerContent = (
		<div className='flex flex-col gap-4 mt-3'>
			<hr />
		</div>
	)

	return (
		<Modal
			title='Форма замовлення'
			actionLabel='Замовити'
			secondaryAction={closeOrderModal}
			secondaryActionLabel='Закрити'
			body={bodyContent}
			footer={footerContent}
			isOpen={isOrderModalOpen}
			onClose={closeOrderModal}
			onSubmit={handleSubmit}
		/>
	)
}

export default OrderModal
