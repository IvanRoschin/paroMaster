'use client'

import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import * as Yup from 'yup'

import { getGoodById } from '@/actions/getTest'
import { sendEmail } from '@/actions/sendEmail'
import { useShoppingCart } from 'app/context/ShoppingCartContext'
import { CartClient } from '../Cart/CartClient'
import Modal from './Modal'

interface CartModalProps {
	isOpen: boolean
}

interface FormValues {
	name: string
	email: string
	phone: string
	cartItems: any[]
	totalAmount: number
}

const CartModal: React.FC<CartModalProps> = ({ isOpen }) => {
	const router = useRouter()
	const { closeCart, cartItems } = useShoppingCart()
	const [isLoading, setIsLoading] = useState(false)

	const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+ [а-яА-ЯіІїЇєЄґҐ']+$/u
	const emailRegex = /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	const phoneRegex = /^\+380\d{9}$/

	const orderSchema = Yup.object().shape({
		name: Yup.string()
			.max(20)
			.min(3)
			.matches(nameRegex, { message: 'Тільки українські букви' })
			.required(`Обов'язкове поле`),
		email: Yup.string()
			.matches(emailRegex, { message: 'Має включати @, від 1 до 63 symbols' })
			.required(`Обов'язкове поле`),
		phone: Yup.string()
			.matches(phoneRegex, { message: 'Має починатись на +380 та 9 цифр номеру' })
			.required(`Обов'язкове поле`),
	})

	const formik = useFormik<FormValues>({
		initialValues: {
			name: '',
			email: '',
			phone: '',
			cartItems: [],
			totalAmount: 0,
		},
		validationSchema: orderSchema,
		onSubmit: async (values, actions) => {
			setIsLoading(true)
			const result = await sendEmail(values)
			setIsLoading(false)

			if (result?.success) {
				actions.resetForm()
				router.push('/')
				closeCart()
				localStorage.clear()
				toast.success('Замовлення відправлене')
			} else {
				toast.error('Щось зломалось')
			}
		},
	})

	const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = formik

	useEffect(() => {
		const fetchGoods = async () => {
			const retrievedGoods = await Promise.all(
				cartItems.map(async item => {
					const fetchedItem = await getGoodById(item.id)
					if (fetchedItem) {
						return fetchedItem
					} else {
						return null
					}
				}),
			)

			const retrievedAmounts = cartItems.map(item => {
				const storedAmount = localStorage.getItem(`amount-${item.id}`)
				return storedAmount ? JSON.parse(storedAmount) : 0
			})
			const totalAmount = retrievedAmounts.reduce((total, amount) => total + amount, 0)

			const quantityGoods = cartItems.map((item, index) => {
				return item ? item.quantity : cartItems[index].quantity
			})

			setFieldValue(
				'cartItems',
				retrievedGoods.filter(item => item !== null),
			)
			setFieldValue('quantity', quantityGoods)

			setFieldValue('totalAmount', totalAmount)
		}

		fetchGoods()
	}, [cartItems, setFieldValue])

	const renderInputField = (
		id: keyof FormValues,
		label: string,
		type: string = 'text',
		placeholder: string = ' ',
	) => (
		<div className='relative'>
			<input
				id={id}
				name={id}
				type={type}
				placeholder={placeholder}
				onChange={handleChange}
				value={id === 'phone' && !values[id].startsWith('+380') ? '+380' + values[id] : values[id]}
				onBlur={handleBlur}
				className={`
					peer
					w-full
					h-10
					p-6
					bg-white
					border-2
					rounded-md
					outline-none
					transition
					disabled:opacity-70 disabled:cursor-not-allowed
					text-neutral-700
					placeholder-white
					placeholder:b-black
					placeholder:text-base 
					${errors[id] && touched[id] ? 'border-rose-300' : 'border-neutral-300'} ${
					errors[id] && touched[id] ? 'focus:border-rose-300' : 'focus:border-neutral-500'
				}`}
			/>
			<label
				htmlFor={id}
				className='
					absolute
					left-0
					p-2
					pl-7
					-top-8
					text-neutral-500
					peer-placeholder-shown:text-base
					peer-placeholder-shown:text-neutral-500
					peer-placeholder-shown:top-2
					transition-all'
			>
				{label}
			</label>
			{errors[id] && touched[id] && (
				<p className='text-rose-300 pl-7 transition-all'>{errors[id] as any} </p>
			)}
		</div>
	)

	const bodyContent = (
		<div className='flex flex-col gap-4'>
			<CartClient />
			<form onSubmit={handleSubmit} autoComplete='off' className='flex flex-col space-y-8'>
				{renderInputField('name', "Введіть iм'я")}
				{renderInputField('email', 'Введіть свій email')}
				{renderInputField('phone', 'Введіть свій телефон', 'tel')}
			</form>
		</div>
	)

	const footerContent = (
		<div className='flex flex-col gap-4 mt-3'>
			<hr />
		</div>
	)

	return (
		<Modal
			disabled={isLoading}
			title='Корзина товарів'
			actionLabel='Замовити'
			secondaryAction={closeCart}
			secondaryActionLabel='Закрити'
			body={bodyContent}
			footer={footerContent}
			isOpen={isOpen}
			onClose={closeCart}
			onSubmit={handleSubmit}
		/>
	)
}

export default CartModal
