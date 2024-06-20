'use client'

import { getGoodById } from '@/actions/goods'
import { getData } from '@/actions/nova'
import { sendEmail } from '@/actions/sendEmail'
import { useShoppingCart } from 'app/context/ShoppingCartContext'
import { orderFormSchema } from 'app/helpers/validationShemas/orderFormShema'

import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface OrderFormProps {
	closeOrderModal: () => void
	resetCart: () => void
}

export interface Warehouse {
	Ref: string
	Description: string
}

enum PaymentMethod {
	CashOnDelivery = 'Оплата після отримання',
	CreditCard = 'Оплата на карту',
	InvoiceForSPD = 'Рахунок для СПД',
}

export interface FormValues {
	name: string
	email: string
	phone: string
	city: string
	warehouse: string
	payment: PaymentMethod
	cartItems: any[]
	totalAmount: number
}

const OrderForm: React.FC<OrderFormProps> = ({ closeOrderModal, resetCart }) => {
	const router = useRouter()
	const { cartItems } = useShoppingCart()
	const [warehouses, updateWarehouses] = useState<Warehouse[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const formik = useFormik<FormValues>({
		initialValues: {
			name: '',
			email: '',
			phone: '+380',
			payment: PaymentMethod.CashOnDelivery,
			city: 'Київ',
			warehouse: '',
			cartItems: [],
			totalAmount: 0,
		},
		validationSchema: orderFormSchema,
		onSubmit: async (values, actions) => {
			const body = {
				apiKey: '8d677609f6e47ce83929374b3afab572',
				modelName: 'AddressGeneral',
				calledMethod: 'searchSettlements',
				methodProperties: {
					CityName: values.city,
					Language: 'UA',
				},
			}
			setIsLoading(true)

			try {
				const response = await getData(body)
				if (response && response.data.data) {
					updateWarehouses(response.data.data)
				}
				const emailResult = await sendEmail(values, orderNumber)
				console.log('values in OrderForm:', values)
				// 				// const orderResult = await addOrder(values) // assuming addOrder

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
				console.error('Error in onSubmit:', error)
				toast.error('Щось зломалось')
			} finally {
				setIsLoading(false)
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

	useEffect(() => {
		const fetchWarehouses = async () => {
			if (!formik.values.city) {
				updateWarehouses([])
				return
			}

			const body = {
				apiKey: '8d677609f6e47ce83929374b3afab572',
				modelName: 'Address',
				calledMethod: 'getWarehouses',
				methodProperties: {
					CityName: formik.values.city,
					Limit: '50',
					Language: 'UA',
				},
			}
			setIsLoading(true)
			try {
				const response = await getData(body)
				if (response && response.data.data) {
					updateWarehouses(response.data.data)
				}
			} catch (error) {
				console.error('Error fetching warehouses:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchWarehouses()
	}, [formik.values.city])

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

	const renderSelectField = (
		id: keyof FormValues,
		label: string,
		options: { value: string; label: string }[],
	) => (
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
				{options.map((option, index) => (
					<option value={option.value} label={option.label} key={index}>
						{option.label}
					</option>
				))}
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
	const paymentOptions = Object.values(PaymentMethod).map(method => ({
		value: method,
		label: method,
	}))

	const warehouseOptions = warehouses.map(warehouse => ({
		value: warehouse.Description,
		label: warehouse.Description,
	}))

	return (
		<form onSubmit={handleSubmit} autoComplete='off' className='flex flex-col space-y-8'>
			{renderInputField('name', "Введіть iм'я та прізвище")}
			{renderInputField('email', 'Введіть  email')}
			{renderInputField('phone', 'Введіть телефон', 'tel')}
			{renderSelectField('payment', 'Оберіть спосіб оплати', paymentOptions)}
			{renderInputField('city', 'Введіть назву міста')}
			{renderSelectField('warehouse', 'Оберіть відділення', warehouseOptions)}
		</form>
	)
}

export default OrderForm
