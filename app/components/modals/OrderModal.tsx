'use client'

import { useShoppingCart } from 'app/context/ShoppingCartContext'
import { FormikProvider, useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { addCustomer } from '@/actions/customers'
import { getGoodById } from '@/actions/goods'
import { getData } from '@/actions/nova'
import { addOrder } from '@/actions/orders'
import { sendCustomerEmail, sendEmail } from '@/actions/sendEmail'
import { orderFormSchema } from '@/helpers/index'
import { SGood } from '@/types/good/IGood'
import { IOrder } from '@/types/order/IOrder'
import { PaymentMethod } from '@/types/paymentMethod'
import { generateOrderNumber } from 'app/helpers/orderNumber'
import FormField from '../input/FormField'
import Modal from './Modal'

interface OrderModalProps {
	isOrderModalOpen: boolean
}

interface Warehouse {
	Ref: string
	Description: string
}

interface FormValues {
	name: string
	surname: string
	email: string
	phone: string
	city: string
	warehouse: string
	payment: PaymentMethod
	cartItems: any
	totalAmount: number
}

const OrderModal: React.FC<OrderModalProps> = ({ isOrderModalOpen }) => {
	const router = useRouter()
	const { cartItems, closeOrderModal, resetCart, getItemQuantity } = useShoppingCart()
	const [warehouses, setWarehouses] = useState<Warehouse[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [orderNumber, setOrderNumber] = useState('')
	const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)

	useEffect(() => {
		const fetchOrderNumber = async () => {
			try {
				const getOrderNumber = await generateOrderNumber()
				setOrderNumber(getOrderNumber)
			} catch (error) {
				console.error('Failed to generate order number:', error)
			}
		}

		fetchOrderNumber()
	}, [])

	const formik = useFormik<FormValues>({
		initialValues: {
			name: '',
			surname: '',
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
				apiKey: process.env.NOVA_API,
				modelName: 'AddressGeneral',
				calledMethod: 'searchSettlements',
				methodProperties: {
					CityName: values.city,
					Language: 'UA',
				},
			}

			const orderData: IOrder = {
				orderNumber: orderNumber,
				customer: {
					name: `${values.name} ${values.surname}`,
					email: values.email,
					phone: values.phone,
					city: values.city,
					warehouse: values.warehouse,
					payment: values.payment,
				},
				orderedGoods: values.cartItems.map((item: SGood) => ({
					id: item._id,
					title: item.title,
					brand: item.brand,
					model: item.model,
					vendor: item.vendor,
					quantity: getItemQuantity(item._id),
					price: item.price,
				})),
				goodsQuantity: cartItems.reduce((total, item) => total + item.quantity, 0),
				totalPrice: values.totalAmount,
				status: 'Новий',
			}

			const formData = new FormData()

			const fullName = `${values.name} ${values.surname}`.trim()
			formData.append('name', fullName)
			formData.append('email', values.email)
			formData.append('phone', values.phone)
			formData.append('city', values.city)
			formData.append('warehouse', values.warehouse)
			formData.append('payment', values.payment as string)

			setIsLoading(true)

			try {
				const response = await getData(body)
				if (response && response.data.data) {
					setWarehouses(response.data.data)
				}
				const emailResult = await sendEmail(values, orderNumber)
				const customerEmailRusult = await sendCustomerEmail(values, orderNumber)
				const orderResult = await addOrder(orderData)
				const customerResult = await addCustomer(formData)

				if (
					emailResult?.success &&
					customerEmailRusult?.success &&
					orderResult?.success &&
					customerResult?.success
				) {
					router.push('/')
					actions.resetForm()
					closeOrderModal()
					resetCart()
					toast.success('Замовлення відправлене')
				} else {
					toast.error('Щось зломалось')
				}
			} catch (error) {
				console.error('Error in onSubmit:', error)
				toast.error('Помилка створення замовлення')
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
				setWarehouses([])
				return
			}

			const request = {
				apiKey: process.env.NOVA_API,
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
				const response = await getData(request)
				if (response && response.data.data) {
					setWarehouses(response.data.data)
				}
			} catch (error) {
				console.error('Error fetching warehouses:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchWarehouses()
	}, [formik.values.city])

	const inputItems = [
		{
			id: 'name',
			label: 'Ім`я',
			type: 'text',
			required: true,
		},
		{
			id: 'surname',
			label: 'Прізвище',
			type: 'text',
			required: true,
		},
		{
			id: 'email',
			label: 'Email',
			type: 'email',
			required: true,
		},
		{
			id: 'phone',
			label: 'Телефон',
			type: 'tel',
			required: true,
		},
		{
			id: 'city',
			label: 'Місто',
		},
		{
			id: 'warehouse',
			label: 'Оберіть відділення',
			options: warehouses.map(warehouse => ({
				value: warehouse.Description,
				label: warehouse.Description,
			})),
			type: 'select',
		},
		{
			id: 'payment',
			label: 'Оберіть спосіб оплати',
			options: Object.values(PaymentMethod).map(method => ({
				value: method,
				label: method,
			})),
			type: 'select',
		},
	]

	const bodyContent = (
		<div className='flex flex-col gap-4'>
			<FormikProvider value={formik}>
				<form onSubmit={handleSubmit} autoComplete='off' className='flex flex-col space-y-8'>
					{inputItems.map(item => (
						<div key={item.id}>
							{item.type === 'select' && (
								<label htmlFor={item.id} className='block mb-2'>
									{item.label}
								</label>
							)}
							<FormField key={item.id} item={item} errors={errors} setFieldValue={setFieldValue} />
						</div>
					))}

					<div className='flex items-center'>
						<input
							id='termsCheckbox'
							type='checkbox'
							checked={isCheckboxChecked}
							onChange={e => setIsCheckboxChecked(e.target.checked)}
							className='mr-2'
						/>
						<label htmlFor='termsCheckbox'>Я погоджуюсь з умовами та правилами</label>
					</div>
				</form>
			</FormikProvider>
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
			onSubmit={formik.handleSubmit}
			disabled={!isCheckboxChecked} // Disable button if checkbox is not checked
		/>
	)
}

export default OrderModal
