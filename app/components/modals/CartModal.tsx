'use client'

import { useState } from 'react'

import Modal from './Modal'

import { useShoppingCart } from 'app/context/ShoppingCartContext'
import { useRouter } from 'next/navigation'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { CartClient } from '../Cart/CartClient'
import Input from '../input/Input'

const CartModal = ({ isOpen }: { isOpen: boolean }) => {
	const router = useRouter()
	const { closeCart, cartQuantity } = useShoppingCart()

	const [isLoading, setIsLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit: SubmitHandler<FieldValues> = data => {
		setIsLoading(true)
		console.log('Send an email')

		///Send an email
	}

	const bodyContent = (
		<div className='flex flex-col gap-4'>
			<CartClient />
		</div>
	)

	const footerContent = (
		<div className='flex flex-col gap-4 mt-3'>
			<Input
				id='email'
				label='Email'
				disabled={isLoading}
				register={register}
				errors={errors}
				required
			/>
			<hr />
		</div>
	)

	return (
		<Modal
			disabled={isLoading}
			title='Корзина товарів'
			actionLabel='Перейти до замовлення'
			body={bodyContent}
			footer={footerContent}
			isOpen={isOpen}
			onClose={closeCart}
			onSubmit={handleSubmit(onSubmit)}
		/>
	)
}

export default CartModal
