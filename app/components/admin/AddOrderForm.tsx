import { getData } from '@/actions/nova'
import { orderFormSchema } from '@/helpers/index'
import { IOrder } from '@/types/index'
import { PaymentMethod } from '@/types/paymentMethod'
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
			{ id: '', title: '', brand: '', model: '', vendor: '', quantity: 1, price: 0 },
		],
		totalPrice: order?.totalPrice || 0,
		status: order?.status || 'Новий',
		goodsQuantity: order?.goodsQuantity || 0,
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
	const mutation = useMutation({
		mutationFn: async (values: IOrder) => {
			return await action(values)
		},
		onSuccess: () => {
			toast.success('Order submitted successfully')
		},
		onError: error => {
			console.error('Error submitting order:', error)
			toast.error('Failed to submit the order. Please try again.')
		},
	})

	const handleSubmit = async (values: IOrder) => {
		try {
			await mutation.mutateAsync(values)
		} catch (error) {
			console.error('Error submitting form:', error)
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
							<FormField item={input} key={index} />
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
								<option value='Завершено'>Завершено</option>
							</Field>
							{errors.status && touched.status && (
								<div className='text-red-500 text-sm'>{errors.status}</div>
							)}
						</div>

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
