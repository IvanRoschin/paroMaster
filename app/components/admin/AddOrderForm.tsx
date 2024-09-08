import { getData } from '@/actions/nova'
import { IOrder } from '@/types/index'
import { PaymentMethod } from '@/types/paymentMethod'

import { orderFormSchema } from '@/helpers/index'
import { useMutation } from '@tanstack/react-query'
import { Field, FieldArray, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import FormField from '../input/FormField'
import CustomButton from './CustomFormikButton'

interface OrderFormProps {
	order?: IOrder
	action: (data: IOrder) => Promise<void>
	title?: string
}

const OrderForm: React.FC<OrderFormProps> = ({ order, action, title }) => {
	const [warehouses, setWarehouses] = useState<{ Ref: string; Description: string }[]>([])

	const [name, surname] = order?.customer.name?.split(' ') || ['', '']

	const initialValues: IOrder = {
		orderNumber: order?.orderNumber || '',
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
			{ id: '', title: '', brand: '', model: '', vendor: '', quantity: 1, price: 0 },
		],
		totalPrice: order?.totalPrice || 0,
		status: order?.status || 'Новий',
		goodsQuantity: order?.goodsQuantity || 0,
	}

	// const validationSchema = Yup.object().shape({
	// 	orderNumber: Yup.string().required('Order number is required'),
	// 	customer: Yup.object().shape({
	// 		name: Yup.string().required('Name is required'),
	// 		email: Yup.string()
	// 			.email('Invalid email')
	// 			.required('Email is required'),
	// 		phone: Yup.string().required('Phone number is required'),
	// 		city: Yup.string().required('City is required'),
	// 		warehouse: Yup.string().required('Warehouse is required'),
	// 		payment: Yup.string()
	// 			.oneOf(Object.values(PaymentMethod))
	// 			.required('Payment method is required'),
	// 	}),
	// 	orderedGoods: Yup.array().of(
	// 		Yup.object().shape({
	// 			id: Yup.string().required('ID is required'),
	// 			title: Yup.string().required('Title is required'),
	// 			brand: Yup.string().required('Brand is required'),
	// 			model: Yup.string().required('Model is required'),
	// 			vendor: Yup.string().required('Vendor is required'),
	// 			quantity: Yup.number()
	// 				.positive()
	// 				.integer()
	// 				.required(`Обов'язкове поле`),
	// 			price: Yup.number()
	// 				.positive()
	// 				.required(`Обов'язкове поле`),
	// 		}),
	// 	),
	// 	totalPrice: Yup.number()
	// 		.positive()
	// 		.required(`Обов'язкове поле`),
	// 	status: Yup.string().required(`Обов'язкове поле`),
	// })

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

	const useSubmitOrder = () => {
		// Define the mutation
		const mutation = useMutation(
			async (values: IOrder) => {
				// Perform the action (e.g., API call to submit order)
				return await action(values)
			},
			{
				onSuccess: () => {
					toast.success('Order submitted successfully')
				},
				onError: error => {
					console.error('Error submitting order:', error)
					toast.error('Failed to submit the order. Please try again.')
				},
			},
		)

		return mutation
	}

	const handleSubmit = async (values: IOrder) => {
		try {
			// Use the mutation for form submission
			const mutation = useSubmitOrder()
			await mutation.mutateAsync(values)
		} catch (error) {
			console.error('Error submitting form:', error)
		}
	}

	// const handleSubmit = async (values: IOrder) => {
	// 	try {
	// 		await action(values)
	// 	} catch (error) {
	// 		console.error('Error submitting form:', error)
	// 	}
	// }

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
							<FormField item={input} key={index} />
						))}
						{/* <div className='flex flex-col space-y-2'>
							<div>
								<label className='block text-sm font-medium'>Name</label>
								<Field
									name='customer.name'
									type='text'
									className='mt-1 p-2 border border-gray-300 rounded-md w-full'
								/>
								{errors.customer?.name && touched.customer?.name && (
									<div className='text-red-500 text-sm'>{errors.customer.name}</div>
								)}
							</div>
							<div>
								<label className='block text-sm font-medium'>Email</label>
								<Field
									name='customer.email'
									type='email'
									className='mt-1 p-2 border border-gray-300 rounded-md'
								/>
								{errors.customer?.email && touched.customer?.email && (
									<div className='text-red-500 text-sm'>{errors.customer.email}</div>
								)}
							</div>
							<div>
								<label className='block text-sm font-medium'>Phone</label>
								<Field
									name='customer.phone'
									type='tel'
									className='mt-1 p-2 border border-gray-300 rounded-md'
								/>
								{errors.customer?.phone && touched.customer?.phone && (
									<div className='text-red-500 text-sm'>{errors.customer.phone}</div>
								)}
							</div>
							<div>
								<label className='block text-sm font-medium'>City</label>
								<Field
									name='customer.city'
									type='text'
									className='mt-1 p-2 border border-gray-300 rounded-md'
								/>
								{errors.customer?.city && touched.customer?.city && (
									<div className='text-red-500 text-sm'>{errors.customer.city}</div>
								)}
							</div>
							<div>
								<label className='block text-sm font-medium'>Warehouse</label>
								<Field
									name='customer.warehouse'
									as='select'
									className='mt-1 p-2 border border-gray-300 rounded-md'
								>
									{warehouses.map(wh => (
										<option key={wh.Ref} value={wh.Description}>
											{wh.Description}
										</option>
									))}
								</Field>
								{errors.customer?.warehouse && touched.customer?.warehouse && (
									<div className='text-red-500 text-sm'>{errors.customer.warehouse}</div>
								)}
							</div>
							<div>
								<label className='block text-sm font-medium'>Payment Method</label>
								<Field
									name='customer.payment'
									as='select'
									className='mt-1 p-2 border border-gray-300 rounded-md'
								>
									{Object.values(PaymentMethod).map(method => (
										<option key={method} value={method}>
											{method}
										</option>
									))}
								</Field>
								{errors.customer?.payment && touched.customer?.payment && (
									<div className='text-red-500 text-sm'>{errors.customer.payment}</div>
								)}
							</div>
						</div> */}

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
															<FormField item={input} />
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

						<div>
							<label className='block text-sm font-medium'>Всього ціна</label>
							<Field
								name='totalPrice'
								type='number'
								className='mt-1 p-2 border border-gray-300 rounded-md'
							/>
							{errors.totalPrice && touched.totalPrice && (
								<div className='text-red-500 text-sm'>{errors.totalPrice}</div>
							)}
						</div>

						<div>
							<label className='block text-sm font-medium'>Статус</label>
							<Field
								name='status'
								as='select'
								className='mt-1 p-2 border border-gray-300 rounded-md'
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
						</div>

						<div className='flex justify-end'>
							<CustomButton label={'Отправить'} />
						</div>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default OrderForm
