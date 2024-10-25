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

	const bodyContent = (
		<div className='flex flex-col justify-center items-center p-4 bg-white rounded-lg shadow-md'>
			<Formik
				initialValues={initialValues}
				validationSchema={orderFormSchema}
				onSubmit={handleSubmit}
				enableReinitialize
			>
				{({ values, errors, setFieldValue }) => {
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
								<FormField item={input} key={index} setFieldValue={setFieldValue} errors={errors} />
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
