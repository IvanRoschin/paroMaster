'use client'

import { Form, Formik, FormikState } from 'formik'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getData } from '@/actions/nova'
import { IOrder } from '@/types/index'
import { PaymentMethod } from '@/types/paymentMethod'
import { orderFormSchema } from 'app/helpers/validationShemas'
import FormField from '../input/FormField'
import CustomButton from './CustomFormikButton'

interface InitialStateType extends Omit<IOrder, '_id'> {}

interface ResetFormProps {
	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface Warehouse {
	Ref: string
	Description: string
}

interface OrderFormProps {
	order?: IOrder
	title?: string
	action: (
		data: FormData,
	) => Promise<{
		success: boolean
		data: {
			orderNumber: string
			customer: {
				name: string
				phone: string
				email: string
				city: string
				warehouse: string
				payment: string
			}
			orderedGoods: {}
		}
	}>
}

const customerInputs = [
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
		type: 'select',
	},
	{
		id: 'payment',
		label: 'Оберіть спосіб оплати',
		type: 'select',
		options: Object.values(PaymentMethod).map(method => ({
			value: method,
			label: method,
		})),
	},
]

const goodsInputs = [
	{
		id: 'title',
		label: 'Назва товару',
		type: 'text',
		required: true,
	},
	{
		id: 'brand',
		label: 'Бренд',
		type: 'text',
		required: true,
	},
	{
		id: 'model',
		label: 'Модель',
		type: 'text',
		required: true,
	},
	{
		id: 'vendor',
		label: 'Артикул',
		type: 'text',
		required: true,
	},
	{
		id: 'quantity',
		label: 'Кількість',
		type: 'number',
		required: true,
	},
	{
		id: 'price',
		label: 'Ціна',
		type: 'number',
		required: true,
	},
]

const AddOrderForm: React.FC<OrderFormProps> = ({ order, title, action }) => {
	const [warehouses, setWarehouses] = useState<Warehouse[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const router = useRouter()

	const initialValues: InitialStateType = {
		orderNumber: order?.orderNumber || '',
		customer: {
			name: order?.customer.name || '',
			email: order?.customer.email || '',
			phone: order?.customer.phone || '+380',
			payment: order?.customer.payment || PaymentMethod.CashOnDelivery.toString(),
			city: order?.customer.city || 'Київ',
			warehouse: order?.customer.warehouse || '',
		},
		orderedGoods: order?.orderedGoods?.map(item => ({
			id: item.id || '', // Ensure id has a default value
			title: item.title || '',
			brand: item.brand || '',
			model: item.model || '',
			vendor: item.vendor || '',
			quantity: item.quantity || 0,
			price: item.price || 0,
		})) || [
			// Provide at least one empty item if no orderedGoods are provided
			{
				id: '',
				title: '',
				brand: '',
				model: '',
				vendor: '',
				quantity: 0,
				price: 0,
			},
		],
		goodsQuantity: order?.goodsQuantity || 0,
		totalPrice: order?.totalPrice || 0,
		status: order?.status || 'Новий',
	}

	const fetchWarehouses = useCallback(async (city: string) => {
		if (!city) {
			setWarehouses([])
			return
		}

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
	}, [])

	useEffect(() => {
		if (initialValues.customer.city) {
			fetchWarehouses(initialValues.customer.city)
		}
	}, [initialValues.customer.city, fetchWarehouses])

	const handleSubmit = async (values: InitialStateType, { resetForm }: ResetFormProps) => {
		const formData = new FormData()

		// Append customer information
		formData.append('name', values.customer.name)
		formData.append('surname', values.customer.surname)
		formData.append('email', values.customer.email)
		formData.append('phone', values.customer.phone)
		formData.append('payment', values.customer.payment)
		formData.append('city', values.customer.city)
		formData.append('warehouse', values.customer.warehouse)

		// Append ordered goods information
		values.orderedGoods.forEach((item, index) => {
			Object.entries(item).forEach(([key, value]) => {
				formData.append(`orderedGoods[${index}][${key}]`, value.toString())
			})
		})

		// Append the ID if available
		if (order?._id) {
			formData.append('id', order._id as string)
		}

		try {
			await action(formData)
			resetForm()
			toast.success(order?._id ? 'Замовлення оновлено!' : 'Нове замовлення додано!')
		} catch (error) {
			toast.error('Помилка!')
			console.error(error)
		}
	}

	return (
		<div className='flex flex-col justify-center items-center'>
			<h2 className='text-4xl mb-4'>{title}</h2>
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={orderFormSchema}
				enableReinitialize
			>
				{({ errors, setFieldValue, values }) => (
					<Form className='flex flex-col w-[600px]'>
						<p>Customer Data</p>
						{customerInputs.map((item, i) => (
							<FormField
								key={i}
								item={{
									...item,
									options:
										item.id === 'warehouse'
											? warehouses.map(wh => ({
													value: wh.Description,
													label: wh.Description,
											  }))
											: item.options,
								}}
								errors={errors}
								setFieldValue={setFieldValue}
							/>
						))}
						<p>Ordered Goods Data</p>
						{goodsInputs.map((item, i) => (
							<FormField key={i} item={item} errors={errors} setFieldValue={setFieldValue} />
						))}
						<CustomButton label='Зберегти' />
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default AddOrderForm
