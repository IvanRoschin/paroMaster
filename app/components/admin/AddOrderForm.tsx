'use client'

import { getData } from '@/actions/nova'
import { orderFormSchema } from '@/helpers/index'
import { useAddData } from '@/hooks/useAddData'
import { useUpdateData } from '@/hooks/useUpdateData'
import { IOrder } from '@/types/index'
import { PaymentMethod } from '@/types/paymentMethod'
import { FieldArray, Form, Formik, FormikState } from 'formik'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import FormField from '../input/FormField'
import CustomButton from './CustomFormikButton'

interface InitialStateType extends Omit<IOrder, '_id'> {}

interface ResetFormProps {
	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface OrderFormProps {
	order?: IOrder
	title?: string
	action: (data: FormData) => Promise<{ success: boolean; message: string }>
}

const statusList = [
	{
		id: 1,
		title: 'Новый',
	},

	{
		id: 2,
		title: 'Опрацьовується',
	},
	{
		id: 3,
		title: 'Оплачено',
	},
	{
		id: 4,
		title: 'На відправку',
	},
	{
		id: 5,
		title: 'Закритий',
	},
]

const OrderForm: React.FC<OrderFormProps> = ({ order, action, title }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [warehouses, setWarehouses] = useState<{ Ref: string; Description: string }[]>([])
	const { push } = useRouter()
	const isUpdating = Boolean(order?._id)
	const [name, surname] = order?.customer.name?.split(' ') || ['', '']

	const addOrderMutation = useAddData(action, 'orders')
	const updateOrderMutation = useUpdateData(action, 'orders')

	const initialValues: IOrder = {
		number: order?.number || '',
		customer: {
			name: name || '',
			surname: surname || '',
			email: order?.customer.email || '',
			phone: order?.customer.phone || '+380',
			city: order?.customer.city || '',
			warehouse: order?.customer.warehouse || '',
			payment: order?.customer.payment || PaymentMethod.CashOnDelivery,
		},
		orderedGoods: order?.orderedGoods || [
			{
				_id: '',
				category: '',
				src: [],
				brand: '',
				model: '',
				vendor: '',
				title: '',
				description: '',
				price: 0,
				isAvailable: false,
				isCompatible: false,
				compatibility: '',
				quantity: 0,
			},
		],
		totalPrice: order?.totalPrice || 0,
		status: order?.status || 'Новий',
	}

	useEffect(() => {
		if (initialValues.customer.city) {
			fetchWarehouses(initialValues.customer.city)
		}
	}, [initialValues.customer.city])

	const fetchWarehouses = async (city: string) => {
		const request = {
			apiKey: process.env.NOVA_API,
			modelName: 'Address',
			calledMethod: 'getWarehouses',
			methodProperties: { CityName: city, Limit: '50', Language: 'UA' },
		}
		try {
			const response = await getData(request)
			setWarehouses(response.data.data || [])
		} catch (error) {
			console.error('Error fetching warehouses:', error)
		}
	}

	// Define the mutation directly inside the component
	// const mutation = useMutation({
	// 	mutationFn: async (values: IOrder) => {
	// 		return await action(values)
	// 	},
	// 	onSuccess: () => {
	// 		toast.success('Order submitted successfully')
	// 	},
	// 	onError: error => {
	// 		console.error('Error submitting order:', error)
	// 		toast.error('Failed to submit the order. Please try again.')
	// 	},
	// })

	const handleSubmit = async (values: IOrder, { resetForm }: ResetFormProps) => {
		console.log('values', values)

		try {
			setIsLoading(true)

			const formData = new FormData()
			Object.keys(values).forEach(key => {
				const value = (values as Record<string, any>)[key]

				if (Array.isArray(value)) {
					// Serialize arrays (e.g., orderedGoods) properly
					formData.append(key, JSON.stringify(value))
				} else if (typeof value === 'object' && value !== null) {
					// Serialize objects (e.g., customer) properly
					formData.append(key, JSON.stringify(value))
				} else {
					// For primitive types, just append them directly
					formData.append(key, value)
				}
			})

			if (isUpdating && order) {
				formData.append('id', order._id as string)
			}

			const result = isUpdating
				? await updateOrderMutation.mutateAsync(formData)
				: await addOrderMutation.mutateAsync(formData)

			if (result?.success === false) {
				toast.error(result.message || 'Something went wrong')
				return
			}
			resetForm()
			toast.success(isUpdating ? 'Замовлення оновлено!' : 'Нове замовлення додано!')
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message)
				console.error(error.message)
			} else {
				toast.error('An unknown error occurred')
				console.error(error)
			}
		} finally {
			setIsLoading(false)
		}
	}

	const customerInputs = [
		{ name: 'customer.name', type: 'text', id: 'name', label: `І'мя`, required: true },
		{ name: 'customer.surname', type: 'text', id: 'surname', label: `Прізвище`, required: true },
		{ name: 'customer.email', type: 'email', id: 'email', label: `Email`, required: true },
		{ name: 'customer.phone', type: 'tel', id: 'phone', label: `Телефон`, required: true },
		{ name: 'customer.city', type: 'text', id: 'city', label: `Місто`, required: true },
		{
			name: 'customer.city',
			id: 'warehouse',
			label: 'Склад',
			type: 'select',
			options: warehouses.map(warehouse => ({
				value: warehouse.Ref,
				label: warehouse.Description,
			})),
			required: true,
		},
	]

	return (
		<div className='flex flex-col justify-center items-center p-4 bg-white rounded-lg shadow-md'>
			<h2 className='text-3xl mb-4 font-bold'>{title || 'Order Form'}</h2>
			<Formik
				initialValues={initialValues}
				validationSchema={orderFormSchema}
				onSubmit={handleSubmit}
				enableReinitialize
			>
				{({ values, errors, touched, setFieldValue }) => (
					<Form className='space-y-4'>
						<h3 className='text-xl font-semibold'>Замовник</h3>
						{customerInputs.map((input, index) => (
							<FormField item={input} key={index} setFieldValue={setFieldValue} errors={errors} />
						))}

						<h3 className='text-xl font-semibold'>Товари у замовленні</h3>
						<FieldArray name='orderedGoods'>
							{({ push, remove }) => (
								<div className='space-y-4'>
									{values.orderedGoods.map((good, index) => {
										const orderedGoodsInputs = [
											{
												name: `orderedGoods.${index}.title`,
												type: 'text',
												id: `title-${index}`,
												label: 'Назва',
												required: true,
											},
											{
												name: `orderedGoods.${index}.brand`,
												type: 'text',
												id: `brand-${index}`,
												label: 'Бренд',
												required: true,
											},
											{
												name: `orderedGoods.${index}.model`,
												type: 'text',
												id: `model-${index}`,
												label: 'Модель',
												required: true,
											},
											{
												name: `orderedGoods.${index}.vendor`,
												type: 'text',
												id: `vendor-${index}`,
												label: 'Vendor',
												required: true,
											},
											{
												name: `orderedGoods.${index}.quantity`,
												type: 'number',
												id: `quantity-${index}`,
												label: 'Кількість',
												required: true,
											},
											{
												name: `orderedGoods.${index}.price`,
												type: 'number',
												id: `price-${index}`,
												label: 'Ціна',
												required: true,
											},
										]

										return (
											<div key={index} className='p-4 border border-gray-300 rounded-md'>
												<div className='grid grid-cols-2 gap-4'>
													{orderedGoodsInputs.map(input => (
														<div key={input.id}>
															<label className='block text-sm font-medium'>{input.label}</label>
															<FormField item={input} errors={errors} />
														</div>
													))}
													<button
														type='button'
														onClick={() => remove(index)}
														className='mt-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600'
													>
														Видалити
													</button>
												</div>
											</div>
										)
									})}
									<button
										type='button'
										onClick={() =>
											push({
												id: '',
												title: '',
												brand: '',
												model: '',
												vendor: '',
												quantity: 1,
												price: 0,
											})
										}
										className='mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
									>
										Додати
									</button>
								</div>
							)}
						</FieldArray>

						<div className='w-[195px]'>
							<label className='block text-sm font-medium'>Всього ціна</label>
							<FormField
								item={{
									type: 'number',
									id: 'totalPrice',
									label: 'Всього ціна',

									required: true,
								}}
								errors={errors}
								setFieldValue={setFieldValue}
							/>
						</div>
						<div className='w-[195px]'>
							<FormField
								item={{
									id: 'status',
									type: 'select',
									options: statusList.map(status => ({
										value: status.title,
										label: status.title,
									})),
									required: true,
								}}
								errors={errors}
								setFieldValue={setFieldValue}
							/>
						</div>

						{/* 
						<div>
							<label className='block text-sm font-medium'>Статус</label>
							<Field
								id
								name='status'
								as='select'
								className='mt-1 p-2 border border-gray-300 rounded-md'
								onChange={setFieldValue}
							>
								<option value='Новый'>Новый</option>
								<option value='Опрацьовується'>Опрацьовується</option>
								<option value='Оплачено'>Оплачено</option>
								<option value='На відправку'>На відправку</option>
								<option value='Закритий'>Закритий</option>
							</Field>
							{errors.status && touched.status && (
								<div className='text-red-500 text-sm'>{errors.status}</div>
							)}
						</div> */}

						<div className='flex justify-end'>
							<CustomButton label={order ? 'Оновити замовлення' : 'Створити замовлення'} />
						</div>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default OrderForm
