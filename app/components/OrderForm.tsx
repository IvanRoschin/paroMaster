'use client'

import { getGoodById } from '@/actions/goods'
import { sendEmail } from '@/actions/sendEmail'
import { useShoppingCart } from 'app/context/ShoppingCartContext'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import * as Yup from 'yup'
import NovaForm from './NovaForm'

interface OrderFormProps {
	closeOrderModal: () => void
	resetCart: () => void
}

enum PaymentMethod {
	CashOnDelivery = 'Оплата після отримання',
	CreditCard = 'Оплата на карту',
	InvoiceForSPD = 'Рахунок для СПД',
}

interface FormValues {
	name: string
	email: string
	phone: string
	city: string
	warehouseId: string
	payment: PaymentMethod
	cartItems: any[]
	totalAmount: number
}

const OrderForm: React.FC<OrderFormProps> = ({ closeOrderModal, resetCart }) => {
	const router = useRouter()
	const { cartItems } = useShoppingCart()

	const [isLoading, setIsLoading] = useState(false)

	const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+ [а-яА-ЯіІїЇєЄґҐ']+$/u
	const emailRegex = /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	const phoneRegex = /^\+380\d{9}$/

	const orderSchema = Yup.object().shape({
		name: Yup.string()
			.max(20)
			.min(3)
			.matches(nameRegex, {
				message: 'Тільки українські букви від 3 до 20 символів',
			})
			.required(`Обов'язкове поле`),
		email: Yup.string()
			.max(63)
			.min(3)
			.email()
			.matches(emailRegex, {
				message: 'Має включати @, від 3 до 63 символів',
			})
			.required(`Обов'язкове поле`),
		phone: Yup.string()
			.matches(phoneRegex, {
				message: 'Має починатись на +380 та 9 цифр номеру',
			})
			.required(`Обов'язкове поле`),
		city: Yup.string()
			.matches(/^[\u0400-\u04FF\s]+$/, 'Підтримується пошук тільки українською мовою...')
			.required(`Обов'язкове поле`),
		warehouseId: Yup.number(),
	})

	const formik = useFormik<FormValues>({
		initialValues: {
			name: '',
			email: '',
			phone: '',
			payment: PaymentMethod.CashOnDelivery,
			city: 'київ',
			warehouseId: '',
			cartItems: [],
			totalAmount: 0,
		},
		validationSchema: orderSchema,
		onSubmit: async (values, actions) => {
			setIsLoading(true)
			try {
				const emailResult = await sendEmail(values)
				console.log(values, values)
				// const orderResult = await addOrder(values) // assuming addOrder
				setIsLoading(false)

				if (emailResult?.success) {
					actions.resetForm()
					router.push('/')
					closeOrderModal()
					resetCart()
					toast.success('Замовлення відправлене')
				} else {
					toast.error('Щось зломалось')
				}
			} catch (error) {
				setIsLoading(false)
				console.error('Error in onSubmit:', error)
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

	const cityRef = useRef<HTMLDivElement>(null)
	const warehouseRef = useRef<HTMLDivElement>(null)

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

	const renderPaymentMethodField = (id: keyof FormValues, label: string) => (
		<div className='relative'>
			<select
				id={id}
				name={id}
				className={`
                peer
                w-full
                h-12
                px-6
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
				style={{ display: 'block' }}
				value={values[id]}
				onBlur={handleBlur}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
					setFieldValue(id, e.currentTarget.value)
				}}
			>
				{Object.values(PaymentMethod).map((method, index) => {
					return (
						<option value={method} label={method} key={index}>
							{method}
						</option>
					)
				})}
			</select>

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

	return (
		<form onSubmit={handleSubmit} autoComplete='off' className='flex flex-col space-y-8'>
			{renderInputField('name', "Введіть iм'я та прізвище")}
			{renderInputField('email', 'Введіть  email')}
			{renderInputField('phone', 'Введіть телефон', 'tel')}
			{renderPaymentMethodField('payment', 'Оберіть спосіб оплати')}
			<NovaForm />
			<button type='submit' disabled={isLoading}>
				{isLoading ? 'Завантаження...' : 'Відправити замовлення'}
			</button>
		</form>
	)
}

export default OrderForm
