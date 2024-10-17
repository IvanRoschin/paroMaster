'use client'

import { addCustomer } from '@/actions/customers'
import { getGoodById } from '@/actions/goods'
import { getData } from '@/actions/nova'
import { addOrder } from '@/actions/orders'
import { sendCustomerEmail, sendEmail } from '@/actions/sendEmail'
import { orderFormSchema } from '@/helpers/index'
import { generateOrderNumber } from '@/helpers/orderNumber'
import { ICustomer, IGood, IOrder } from '@/types/index'
import { PaymentMethod } from '@/types/paymentMethod'
import { useShoppingCart } from 'app/context/ShoppingCartContext'
import { Form, Formik, FormikState } from 'formik'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import FormField from '../input/FormField'
import Modal from './Modal'

interface InitialStateType {
	name: string
	surname: string
	email: string
	phone: string
	city: string
	warehouse: string
	payment: any
}

interface ResetFormProps {
	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface OrderModalProps {
	isOrderModalOpen: boolean
}

const OrderModal: React.FC<OrderModalProps> = ({ isOrderModalOpen }) => {
	const { cartItemsId, closeOrderModal, resetCart, getItemQuantity } = useShoppingCart()
	const [warehouses, setWarehouses] = useState<
		{
			Ref: string
			Description: string
		}[]
	>([])
	const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)

	const [orderNumber, setOrderNumber] = useState<string>('')
	const [orderedGoods, setOrderedGoods] = useState<IGood[]>([])
	const [totalPrice, setTotalPrice] = useState<number>(0)
	const [customer, setCustomer] = useState<ICustomer>()

	const { push } = useRouter()

	const customerInputs = [
		{
			name: 'name',
			type: 'text',
			id: 'name',
			label: `І'мя`,
			required: true,
		},
		{
			name: 'surname',
			type: 'text',
			id: 'surname',
			label: `Прізвище`,
			required: true,
		},
		{
			name: 'email',
			type: 'email',
			id: 'email',
			label: `Email`,
			required: true,
		},
		{
			name: 'phone',
			type: 'tel',
			id: 'phone',
			label: `Телефон`,
			required: true,
		},
		{
			name: 'city',
			type: 'text',
			id: 'city',
			label: `Місто`,
			required: true,
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

	const initialValues = {
		name: '',
		surname: '',
		email: '',
		phone: '+380',
		city: 'Київ',
		warehouse: '',
		payment: PaymentMethod.CashOnDelivery,
	}

	// Fetch goods and update form values
	useEffect(() => {
		const fetchGoods = async () => {
			const retrievedGoods = await Promise.all(
				cartItemsId.map(async item => {
					const fetchedItem = await getGoodById(item.id)
					const quantity = getItemQuantity(item.id)
					const itemObject = {
						...fetchedItem,
						quantity,
					}

					if (itemObject) {
						return itemObject
					} else {
						return null
					}
				}),
			)

			const retrievedAmounts = cartItemsId.map(item => {
				const storedAmount = localStorage.getItem(`amount-${item.id}`)
				return storedAmount ? JSON.parse(storedAmount) : 0
			})
			const totalAmount = retrievedAmounts.reduce((total, amount) => total + amount, 0)

			setOrderedGoods(retrievedGoods.filter(item => item !== null) as IGood[])
			setTotalPrice(totalAmount)
		}
		const fetchOrderNumber = () => {
			const getOrderNumber = generateOrderNumber()
			setOrderNumber(getOrderNumber)
		}

		fetchGoods()
		fetchOrderNumber()
	}, [cartItemsId])

	const fetchWarehouses = async (city: string) => {
		const request = {
			apiKey: process.env.NOVA_API,
			modelName: 'Address',
			calledMethod: 'getWarehouses',
			methodProperties: {
				CityName: city,
				Limit: '50',
				Language: 'UA',
			},
		}
		try {
			const response = await getData(request)
			setWarehouses(response.data.data || [])
		} catch (error) {
			console.error('Error fetching warehouses:', error)
		}
	}

	const handleSubmit = async () => {
		try {
			if (customer) {
				const orderData: IOrder = {
					number: orderNumber,
					customer: {
						name: `${customer?.name} ${customer?.surname}`,
						email: customer?.email,
						phone: customer?.phone,
						city: customer?.city,
						warehouse: customer?.warehouse,
						payment: customer?.payment,
					},
					orderedGoods,
					totalPrice,
					status: 'Новий',
				}
				const mailData = {
					...customer,
					orderNumber,
					orderedGoods,
					totalPrice,
				}
				const emailResult = await sendEmail(mailData)
				const customerEmailRusult = await sendCustomerEmail(mailData)
				const orderResult = await addOrder(orderData)
				const customerResult = await addCustomer(customer)

				if (
					emailResult?.success &&
					customerEmailRusult?.success &&
					orderResult?.success &&
					customerResult?.success
				) {
					push('/')
					closeOrderModal()
					resetCart()
					toast.success('Замовлення відправлене', {
						duration: 3000,
					})
				} else {
					toast.error('Щось зломалось')
				}

				closeOrderModal()
				resetCart()
				toast.success('Замовлення відправлене')
			}

			// Process order submission
		} catch (error) {
			console.error('Error submitting order:', error)
			toast.error('Помилка створення замовлення')
		} finally {
		}
	}

	// const handleSubmit = async (values: InitialStateType, { resetForm }: ResetFormProps) => {
	// 	try {
	// 		setIsLoading(true)

	// 		// Create FormData
	// 		const formData = new FormData()
	// 		Object.keys(values).forEach(key => {
	// 			const value = (values as Record<string, any>)[key]
	// 			if (Array.isArray(value)) {
	// 				value.forEach(val => formData.append(key, val))
	// 			} else {
	// 				formData.append(key, value)
	// 			}
	// 		})

	// 		// Perform the mutation (add or update)
	// 		const result = await addOrderMutation.mutateAsync(formData)

	// 		// Handle result
	// 		if (!result?.success) {
	// 			toast.error(result.message || 'Error processing the order')
	// 			return
	// 		}

	// 		// Success
	// 		resetForm()
	// 		toast.success('Order submitted successfully!')
	// 		router.push('/')
	// 	} catch (error) {
	// 		if (error instanceof Error) {
	// 			toast.error(error.message)
	// 			console.error(error.message)
	// 		} else {
	// 			toast.error('An unknown error occurred')
	// 			console.error(error)
	// 		}
	// 	} finally {
	// 		setIsLoading(false)
	// 	}
	// }

	const bodyContent = (
		<div className='flex flex-col justify-center items-center p-4 bg-white rounded-lg shadow-md'>
			<Formik
				initialValues={initialValues}
				validationSchema={orderFormSchema}
				onSubmit={handleSubmit}
				enableReinitialize
			>
				{({ values, errors, touched, setFieldValue }) => {
					useEffect(() => {
						if (values.city) {
							fetchWarehouses(values.city)
						}
					}, [values.city])

					useEffect(() => {
						setCustomer(values)
					}, [values])

					return (
						<Form className='flex flex-col space-y-8'>
							{customerInputs.map((input, index) => (
								<FormField item={input} key={index} setFieldValue={setFieldValue} />
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
						</Form>
					)
				}}
			</Formik>
		</div>
	)

	return (
		<Modal
			title='Форма замовлення'
			actionLabel='Замовити'
			secondaryAction={closeOrderModal}
			secondaryActionLabel='Закрити'
			body={bodyContent}
			isOpen={isOrderModalOpen}
			onClose={closeOrderModal}
			onSubmit={handleSubmit}
			disabled={!isCheckboxChecked}
		/>
	)
}

export default OrderModal

// 'use client'

// import { useShoppingCart } from 'app/context/ShoppingCartContext'
// import { FormikProvider, useFormik } from 'formik'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import { toast } from 'sonner'

// import { addCustomer } from '@/actions/customers'
// import { getGoodById } from '@/actions/goods'
// import { getData } from '@/actions/nova'
// import { addOrder } from '@/actions/orders'
// import { sendCustomerEmail, sendEmail } from '@/actions/sendEmail'
// import { orderFormSchema } from '@/helpers/index'
// import { SGood } from '@/types/good/IGood'
// import { IOrder } from '@/types/order/IOrder'
// import { PaymentMethod } from '@/types/paymentMethod'
// import { generateOrderNumber } from 'app/helpers/orderNumber'
// import FormField from '../input/FormField'
// import Modal from './Modal'

// interface OrderModalProps {
// 	isOrderModalOpen: boolean
// }

// interface Warehouse {
// 	Ref: string
// 	Description: string
// }

// interface FormValues {
// 	name: string
// 	surname: string
// 	email: string
// 	phone: string
// 	city: string
// 	warehouse: string
// 	payment: PaymentMethod
// 	cartItemsId: any
// 	totalAmount: number
// }

// const OrderModal: React.FC<OrderModalProps> = ({ isOrderModalOpen }) => {
// 	const router = useRouter()
// 	const { cartItemsId, closeOrderModal, resetCart, getItemQuantity } = useShoppingCart()
// 	const [warehouses, setWarehouses] = useState<Warehouse[]>([])
// 	const [isLoading, setIsLoading] = useState(false)
// 	const [orderNumber, setOrderNumber] = useState('')
// 	const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)

// 	useEffect(() => {
// 		const fetchOrderNumber = async () => {
// 			try {
// 				const getOrderNumber = generateOrderNumber()
// 				setOrderNumber(getOrderNumber)
// 			} catch (error) {
// 				console.error('Failed to generate order number:', error)
// 			}
// 		}

// 		fetchOrderNumber()
// 	}, [])

// 	const formik = useFormik<FormValues>({
// 		initialValues: {
// 			name: '',
// 			surname: '',
// 			email: '',
// 			phone: '+380',
// 			payment: PaymentMethod.CashOnDelivery,
// 			city: 'Київ',
// 			warehouse: '',
// 			cartItemsId: [],
// 			totalAmount: 0,
// 		},
// 		validationSchema: orderFormSchema,
// 		onSubmit: async (values, actions) => {
// 			console.log('values', values)
// 			const body = {
// 				apiKey: process.env.NOVA_API,
// 				modelName: 'AddressGeneral',
// 				calledMethod: 'searchSettlements',
// 				methodProperties: {
// 					CityName: values.city,
// 					Language: 'UA',
// 				},
// 			}

// 			const orderData: IOrder = {
// 				number: orderNumber,
// 				customer: {
// 					name: `${values.name} ${values.surname}`,
// 					email: values.email,
// 					phone: values.phone,
// 					city: values.city,
// 					warehouse: values.warehouse,
// 					payment: values.payment,
// 				},
// 				orderedGoods: values.cartItemsId.map((item: SGood) => ({
// 					id: item._id,
// 					title: item.title,
// 					brand: item.brand,
// 					model: item.model,
// 					vendor: item.vendor,
// 					quantity: getItemQuantity(item._id),
// 					price: item.price,
// 				})),
// 				goodsQuantity: cartItemsId.reduce((total, item) => total + item.quantity, 0),
// 				totalPrice: values.totalAmount,
// 				status: 'Новий',
// 			}

// 			const formData = new FormData()

// 			const fullName = `${values.name} ${values.surname}`.trim()
// 			formData.append('name', fullName)
// 			formData.append('email', values.email)
// 			formData.append('phone', values.phone)
// 			formData.append('city', values.city)
// 			formData.append('warehouse', values.warehouse)
// 			formData.append('payment', values.payment as string)

// 			setIsLoading(true)

// 			try {
// 				const response = await getData(body)
// 				if (response && response.data.data) {
// 					setWarehouses(response.data.data)
// 				}
// 				const emailResult = await sendEmail(values, orderNumber)
// 				const customerEmailRusult = await sendCustomerEmail(values, orderNumber)
// 				const orderResult = await addOrder(orderData)
// 				const customerResult = await addCustomer(formData)

// 				if (
// 					emailResult?.success &&
// 					customerEmailRusult?.success &&
// 					orderResult?.success &&
// 					customerResult?.success
// 				) {
// 					router.push('/')
// 					actions.resetForm()
// 					closeOrderModal()
// 					resetCart()
// 					toast.success('Замовлення відправлене')
// 				} else {
// 					toast.error('Щось зломалось')
// 				}
// 			} catch (error) {
// 				console.error('Error in onSubmit:', error)
// 				toast.error('Помилка створення замовлення')
// 			} finally {
// 				setIsLoading(false)
// 			}
// 		},
// 	})

// 	const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = formik

// 	useEffect(() => {
// 		const fetchGoods = async () => {
// 			const retrievedGoods = await Promise.all(
// 				cartItemsId.map(async item => {
// 					const fetchedItem = await getGoodById(item.id)
// 					if (fetchedItem) {
// 						return fetchedItem
// 					} else {
// 						return null
// 					}
// 				}),
// 			)

// 			const retrievedAmounts = cartItemsId.map(item => {
// 				const storedAmount = localStorage.getItem(`amount-${item.id}`)
// 				return storedAmount ? JSON.parse(storedAmount) : 0
// 			})
// 			const totalAmount = retrievedAmounts.reduce((total, amount) => total + amount, 0)

// 			const quantityGoods = cartItemsId.map((item, index) => {
// 				return item ? item.quantity : cartItemsId[index].quantity
// 			})
// 			setFieldValue(
// 				'cartItems',
// 				retrievedGoods.filter(item => item !== null),
// 			)
// 			setFieldValue('quantity', quantityGoods)
// 			setFieldValue('totalAmount', totalAmount)
// 		}

// 		fetchGoods()
// 	}, [cartItemsId, setFieldValue])

// 	useEffect(() => {
// 		const fetchWarehouses = async () => {
// 			if (!formik.values.city) {
// 				setWarehouses([])
// 				return
// 			}

// 			const request = {
// 				apiKey: process.env.NOVA_API,
// 				modelName: 'Address',
// 				calledMethod: 'getWarehouses',
// 				methodProperties: {
// 					CityName: formik.values.city,
// 					Limit: '50',
// 					Language: 'UA',
// 				},
// 			}
// 			setIsLoading(true)
// 			try {
// 				const response = await getData(request)
// 				if (response && response.data.data) {
// 					setWarehouses(response.data.data)
// 				}
// 			} catch (error) {
// 				console.error('Error fetching warehouses:', error)
// 			} finally {
// 				setIsLoading(false)
// 			}
// 		}

// 		fetchWarehouses()
// 	}, [formik.values.city])

// 	const inputItems = [
// 		{
// 			id: 'name',
// 			label: 'Ім`я',
// 			type: 'text',
// 			required: true,
// 		},
// 		{
// 			id: 'surname',
// 			label: 'Прізвище',
// 			type: 'text',
// 			required: true,
// 		},
// 		{
// 			id: 'email',
// 			label: 'Email',
// 			type: 'email',
// 			required: true,
// 		},
// 		{
// 			id: 'phone',
// 			label: 'Телефон',
// 			type: 'tel',
// 			required: true,
// 		},
// 		{
// 			id: 'city',
// 			label: 'Місто',
// 		},
// 		{
// 			id: 'warehouse',
// 			label: 'Оберіть відділення',
// 			options: warehouses.map(warehouse => ({
// 				value: warehouse.Description,
// 				label: warehouse.Description,
// 			})),
// 			type: 'select',
// 		},
// 		{
// 			id: 'payment',
// 			label: 'Оберіть спосіб оплати',
// 			options: Object.values(PaymentMethod).map(method => ({
// 				value: method,
// 				label: method,
// 			})),
// 			type: 'select',
// 		},
// 	]

// 	const bodyContent = (
// 		<div className='flex flex-col gap-4'>
// 			<FormikProvider value={formik}>
// 				<form autoComplete='off' className='flex flex-col space-y-8'>
// 					{inputItems.map(item => (
// 						<div key={item.id}>
// 							{item.type === 'select' && (
// 								<label htmlFor={item.id} className='block mb-2'>
// 									{item.label}
// 								</label>
// 							)}
// 							<FormField key={item.id} item={item} errors={errors} setFieldValue={setFieldValue} />
// 						</div>
// 					))}

// 					<div className='flex items-center'>
// 						<input
// 							id='termsCheckbox'
// 							type='checkbox'
// 							checked={isCheckboxChecked}
// 							onChange={e => setIsCheckboxChecked(e.target.checked)}
// 							className='mr-2'
// 						/>
// 						<label htmlFor='termsCheckbox'>Я погоджуюсь з умовами та правилами</label>
// 					</div>
// 				</form>
// 			</FormikProvider>
// 		</div>
// 	)

// 	const footerContent = (
// 		<div className='flex flex-col gap-4 mt-3'>
// 			<hr />
// 		</div>
// 	)

// 	return (
// 		<Modal
// 			title='Форма замовлення'
// 			actionLabel='Замовити'
// 			secondaryAction={closeOrderModal}
// 			secondaryActionLabel='Закрити'
// 			body={bodyContent}
// 			footer={footerContent}
// 			isOpen={isOrderModalOpen}
// 			onClose={closeOrderModal}
// 			onSubmit={formik.handleSubmit}
// 			disabled={!isCheckboxChecked} // Disable button if checkbox is not checked
// 		/>
// 	)
// }

// export default OrderModal
