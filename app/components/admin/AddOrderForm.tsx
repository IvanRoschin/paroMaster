'use client'

import { getData } from '@/actions/nova'
import { useAddData } from '@/hooks/useAddData'
import { useUpdateData } from '@/hooks/useUpdateData'
import { IOrder } from '@/types/index'
import { PaymentMethod } from '@/types/paymentMethod'
import { FieldArray, Form, Formik, FormikState } from 'formik'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Button from '../Button'
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
	{ id: 1, title: 'Новый' },
	{ id: 2, title: 'Опрацьовується' },
	{ id: 3, title: 'Оплачено' },
	{ id: 4, title: 'На відправку' },
	{ id: 5, title: 'Закритий' },
]

const OrderForm: React.FC<OrderFormProps> = ({ order, action, title }) => {
	console.log('order', order)

	const [isLoading, setIsLoading] = useState(false)
	const [warehouses, setWarehouses] = useState<{ Ref: string; Description: string }[]>([])
	const { push } = useRouter()
	const isUpdating = Boolean(order?._id)
	const [name, surname] = order?.customer.name?.split(' ') || ['', '']

	const addOrderMutation = useAddData(action, 'orders')
	const updateOrderMutation = useUpdateData(action, 'orders')

	const initialValues: InitialStateType = {
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

	const handleSubmit = async (values: IOrder, { resetForm }: ResetFormProps) => {
		try {
			setIsLoading(true)

			const formData = new FormData()
			Object.entries(values).forEach(([key, value]) => {
				if (Array.isArray(value) || typeof value === 'object') {
					formData.append(key, JSON.stringify(value))
				} else if (value !== null) {
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
				toast.error('Something went wrong')
				return
			}

			resetForm()
			toast.success(isUpdating ? 'Замовлення оновлено!' : 'Нове замовлення додано!')
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred'
			toast.error(errorMsg)
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='flex flex-col justify-center items-center p-4 bg-white rounded-lg shadow-md'>
			<h2 className='text-3xl mb-4 font-bold'>{title || 'Order Form'}</h2>
			<Formik initialValues={initialValues || []} onSubmit={handleSubmit}>
				{({ values, errors, setFieldValue }) => (
					<Form>
						<h3 className='text-xl font-semibold'>Замовник</h3>
						{[
							{ name: 'customer.name', type: 'text', id: 'name', label: `І'мя`, required: true },
							{
								name: 'customer.surname',
								type: 'text',
								id: 'surname',
								label: `Прізвище`,
								required: true,
							},
							{
								name: 'customer.email',
								type: 'email',
								id: 'email',
								label: `Email`,
								required: true,
							},
							{
								name: 'customer.phone',
								type: 'tel',
								id: 'phone',
								label: `Телефон`,
								required: true,
							},
							{ name: 'customer.city', type: 'text', id: 'city', label: `Місто`, required: true },
							{
								name: 'customer.warehouse',
								id: 'warehouse',
								label: 'Склад',
								type: 'select',
								required: true,
								options: warehouses.map(warehouse => ({
									value: warehouse.Ref,
									label: warehouse.Description,
								})),
							},
						].map((input, index) => (
							<FormField item={input} key={index} setFieldValue={setFieldValue} errors={errors} />
						))}
						<h3 className='text-xl font-semibold'>Товари у замовленні</h3>
						<FieldArray
							name='orderedGoods'
							render={({ remove, push }) => (
								<div>
									{values.orderedGoods.map((good, index) => (
										<>
											<div
												key={index}
												className='border p-4 mb-4 flex grow-0 justify-between gap-2 items-center'
											>
												<div className='w-[150px] '>
													<Image
														src={good.src[0] || '/placeholder.png'}
														alt='item_photo'
														width={150}
														height={150}
														className='self-center flex items-center justify-center'
													/>
												</div>
												<span>{good?.title || 'Unnamed Item'}</span>
												<span className='w-[15px] h-[15px]'>
													<Button
														type='button'
														label='-'
														onClick={() =>
															setFieldValue(
																`orderedGoods.${index}.quantity`,
																Math.max((good?.quantity || 0) - 1, 0),
															)
														}
													/>
												</span>
												<span>{good.quantity || 0}</span>
												<span className='w-[15px] h-[15px]'>
													<Button
														type='button'
														label='+'
														onClick={() =>
															setFieldValue(
																`orderedGoods.${index}.quantity`,
																(good?.quantity || 0) + 1,
															)
														}
													/>
												</span>
												<span>Ціна товару: {good.price * (good?.quantity || 1)}</span>
												<button
													type='button'
													onClick={() => remove(index)}
													className='mt-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600'
												>
													Видалити
												</button>
											</div>
										</>
									))}
								</div>
							)}
						/>
						<FormField
							item={{
								id: 'status',
								type: 'select',
								required: true,
								options: statusList.map(status => ({ value: status.title, label: status.title })),
							}}
							errors={errors}
							setFieldValue={setFieldValue}
						/>
						<div className='flex justify-end'>
							<CustomButton
								type='submit'
								label={order ? 'Оновити замовлення' : 'Створити замовлення'}
								disabled={isLoading}
							/>
						</div>{' '}
					</Form>
				)}
			</Formik>
			{/* <Formik
				initialValues={initialValues}
				validationSchema={orderFormSchema}
				onSubmit={handleSubmit}
				enableReinitialize
			>
				{({ values, errors, setFieldValue }) => (
					<Form className='space-y-4'>
						{/* <h3 className='text-xl font-semibold'>Замовник</h3>
						{[
							{ name: 'customer.name', type: 'text', id: 'name', label: `І'мя`, required: true },
							{
								name: 'customer.surname',
								type: 'text',
								id: 'surname',
								label: `Прізвище`,
								required: true,
							},
							{
								name: 'customer.email',
								type: 'email',
								id: 'email',
								label: `Email`,
								required: true,
							},
							{
								name: 'customer.phone',
								type: 'tel',
								id: 'phone',
								label: `Телефон`,
								required: true,
							},
							{ name: 'customer.city', type: 'text', id: 'city', label: `Місто`, required: true },
							{
								name: 'customer.warehouse',
								id: 'warehouse',
								label: 'Склад',
								type: 'select',
								required: true,
								options: warehouses.map(warehouse => ({
									value: warehouse.Ref,
									label: warehouse.Description,
								})),
							},
						].map((input, index) => (
							<FormField item={input} key={index} setFieldValue={setFieldValue} errors={errors} />
						))} */}
			{/* 
						<h3 className='text-xl font-semibold'>Товари у замовленні</h3>
						<FieldArray name='orderedGoods'>
							{({ remove }) => (
								<div>
									{values.orderedGoods.map((good, index) => (
										<div
											key={index}
											className='border p-4 mb-4 flex grow-0 justify-between gap-2 items-center'
										>
											<div className='w-[150px]'>
												<Image
													src={good.src[0] || '/placeholder.png'}
													alt='item_photo'
													width={150}
													height={150}
													className='self-center flex items-center justify-center'
												/>
											</div>
											<span>{good.title || 'Unnamed Item'}</span>
											<Button
												label='-'
												onClick={() =>
													setFieldValue(
														`orderedGoods.${index}.quantity`,
														Math.max((good.quantity || 0) - 1, 0),
													)
												}
											/>
											<span>{good.quantity || 0}</span>
											<Button
												label='+'
												onClick={() =>
													setFieldValue(`orderedGoods.${index}.quantity`, (good.quantity || 0) + 1)
												}
											/>
											<span>Ціна товару: {good.price * (good.quantity || 1)}</span>
											<button
												type='button'
												onClick={() => remove(index)}
												className='mt-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600'
											>
												Видалити
											</button>
										</div>
									))}
								</div>
							)}
						</FieldArray> */}
			{/* <FormField
							item={{ type: 'number', id: 'totalPrice', label: 'Всього ціна', required: true }}
							errors={errors}
							setFieldValue={setFieldValue}
						/> */}
			{/* <FormField
							item={{
								id: 'status',
								type: 'select',
								required: true,
								options: statusList.map(status => ({ value: status.title, label: status.title })),
							}}
							errors={errors}
							setFieldValue={setFieldValue}
						/>

						<div className='flex justify-end'>
							<CustomButton
								type='submit'
								label={order ? 'Оновити замовлення' : 'Створити замовлення'}
								disabled={isLoading}
							/>
						</div>
					</Form>
				)}
			</Formik> */}{' '}
		</div>
	)
}

export default OrderForm
