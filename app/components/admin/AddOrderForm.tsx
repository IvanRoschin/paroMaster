'use client'

import { getData } from '@/actions/nova'
import { useAddData } from '@/hooks/useAddData'
import { useUpdateData } from '@/hooks/useUpdateData'
import { IGood, IOrder } from '@/types/index'
import { PaymentMethod } from '@/types/paymentMethod'
import { FieldArray, Formik, FormikState } from 'formik'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Button from '../Button'
import { Icon } from '../Icon'
import FormField from '../input/FormField'
import CustomButton from './CustomFormikButton'

interface InitialStateType extends Omit<IOrder, '_id'> {}

interface ResetFormProps {
	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface OrderFormProps {
	order?: IOrder
	title?: string
	action: (values: IOrder) => Promise<{ success: boolean; message: string }>
}

const statusList = [
	{ id: 1, title: 'Новый' },
	{ id: 2, title: 'Опрацьовується' },
	{ id: 3, title: 'Оплачено' },
	{ id: 4, title: 'На відправку' },
	{ id: 5, title: 'Закритий' },
]

const OrderForm: React.FC<OrderFormProps> = ({ order, action, title }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [warehouses, setWarehouses] = useState<
		{
			Ref: string
			Description: string
		}[]
	>([])
	const [warehouse, setWarehouse] = useState(order?.customer.warehouse)
	const [totalPrice, setTotalPrice] = useState(0)

	const { push } = useRouter()
	const isUpdating = Boolean(order?._id)
	const [name = '', surname = ''] = (order?.customer.name || '').split(' ')

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
			warehouse: order?.customer.warehouse || 'Київ',
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

	const customerInputs = [
		{
			name: 'customer.name',
			type: 'text',
			id: 'customer.name',
			label: `І'мя`,
			required: true,
		},
		{
			name: 'customer.surname',
			type: 'text',
			id: 'customer.surname',
			label: `Прізвище`,
			required: true,
		},
		{
			name: 'customer.email',
			type: 'email',
			id: 'customer.email',
			label: `Email`,
			required: true,
		},
		{
			name: 'customer.phone',
			type: 'tel',
			id: 'customer.phone',
			label: `Телефон`,
			required: true,
		},
		{
			name: 'customer.city',
			type: 'text',
			id: 'customer.city',
			label: `Місто`,
			required: true,
		},
		{
			id: 'customer.warehouse',
			label: 'Оберіть відділення',
			options: warehouses.map(warehouse => ({
				value: warehouse.Description,
				label: warehouse.Description,
			})),
			type: 'select',
		},
		{
			id: 'customer.payment',
			label: 'Оберіть спосіб оплати',
			options: Object.values(PaymentMethod).map(method => ({
				value: method,
				label: method,
			})),
			type: 'select',
		},
	]

	// useEffect(() => {
	// 	if (initialValues.customer.city) {
	// 		fetchWarehouses(initialValues.customer.city)
	// 	}
	// }, [initialValues.customer.city])

	const fetchWarehouses = async (city: string): Promise<{ Ref: string; Description: string }[]> => {
		try {
			const response = await getData({
				apiKey: process.env.NOVA_API,
				modelName: 'Address',
				calledMethod: 'getWarehouses',
				methodProperties: { CityName: city, Limit: '50', Language: 'UA' },
			})
			return response.data.data || []
		} catch (error) {
			console.error('Error fetching warehouses:', error)
			return []
		}
	}

	const calculateTotalPrice = useCallback((orderedGoods: IGood[]): number => {
		return orderedGoods.reduce((total: number, item: IGood) => {
			const quantity = item.quantity ?? 1
			return total + item.price * quantity
		}, 0)
	}, [])

	useEffect(() => {
		setTotalPrice(calculateTotalPrice(initialValues.orderedGoods))
	}, [initialValues.orderedGoods, calculateTotalPrice])

	// const calculateTotalPrice = (goods: typeof initialValues.orderedGoods) => {
	// 	return goods.reduce((total, good) => total + good.price * (good.quantity ?? 0), 0)
	// }

	useEffect(() => {
		if (initialValues.customer.city) {
			const fetchAndSetWarehouses = async () => {
				try {
					const fetchedWarehouses = await fetchWarehouses(initialValues.customer.city)
					setWarehouses(fetchedWarehouses)
				} catch (error) {
					console.error('Error fetching warehouses:', error)
				}
			}
			fetchAndSetWarehouses()
		}
	}, [initialValues.customer.city])

	const handlePriceChange = (values: InitialStateType) => {
		setTotalPrice(calculateTotalPrice(values.orderedGoods))
	}

	const handleCityChange = async (values: InitialStateType) => {
		try {
			const warehouses = await fetchWarehouses(values.customer.city)
			setWarehouses(warehouses)
			setWarehouse(values.customer.warehouse)
		} catch (error) {
			console.error('Error fetching warehouses:', error)
		}
	}

	const handleQuantityChange = (
		index: number,
		change: number,
		values: InitialStateType,
		setFieldValue: any,
	) => {
		const newQuantity = Math.max((values.orderedGoods[index].quantity || 0) + change, 1)
		setFieldValue(`orderedGoods.${index}.quantity`, newQuantity)
		setTotalPrice(calculateTotalPrice(values.orderedGoods))
	}

	const handleSubmit = async (values: IOrder, { resetForm }: ResetFormProps) => {
		try {
			setIsLoading(true)

			const newOrderData = {
				...values,
				totalPrice,
				customer: {
					...values.customer,
					name: `${values.customer.name} ${values.customer.surname}`,
					warehouse,
				},
			}

			let updateOrderData = {}

			if (isUpdating && order) {
				updateOrderData = {
					...values,
					totalPrice,
					_id: order._id,
					customer: {
						...values.customer,
						name: `${values.customer.name} ${values.customer.surname}`,
						warehouse,
					},
				}
			}
			console.log('updateOrderData', updateOrderData)

			const result = isUpdating
				? await updateOrderMutation.mutateAsync(updateOrderData)
				: await addOrderMutation.mutateAsync(newOrderData)

			if (result?.success === false) {
				toast.error('Something went wrong')
				return
			}

			resetForm()
			toast.success(isUpdating ? 'Замовлення оновлено!' : 'Нове замовлення додано!')
			push('/admin/orders')
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
			<Formik initialValues={initialValues} onSubmit={handleSubmit}>
				{({ values, setFieldValue, errors }) => {
					handlePriceChange(values)
					handleCityChange(values)

					return (
						<>
							{/* Form content */}
							<label className='text-xl font-semibold'>Статус замовлення</label>
							<FormField
								item={{
									id: 'status',
									type: 'select',
									required: true,
									options: statusList.map(status => ({
										value: status.title,
										label: status.title,
									})),
								}}
								errors={errors}
								setFieldValue={setFieldValue}
							/>
							<h3 className='text-xl font-semibold'>Замовник</h3>
							{customerInputs.map((item, i) => (
								<FormField key={i} item={item} setFieldValue={setFieldValue} errors={errors} />
							))}
							<h3 className='text-xl font-semibold'>Товари у замовленні</h3>
							<FieldArray
								name='orderedGoods'
								render={({ remove }) => (
									<div>
										{values?.orderedGoods.map((good, index) => (
											<div
												key={index}
												className='border p-4 mb-4 flex items-center gap-4 justify-between'
											>
												{/* Image container */}
												<div className='flex-shrink-0 w-[150px]'>
													<Image
														src={good.src[0] || '/placeholder.png'}
														alt='item_photo'
														width={150}
														height={150}
														className='object-cover'
													/>
												</div>

												{/* Item title */}
												<div className='flex-1 text-center'>
													<span>{good?.title || 'Unnamed Item'}</span>
												</div>

												{/* Quantity decrement button */}
												<div className='w-[30px] flex justify-center'>
													<Button
														type='button'
														label='-'
														onClick={() => handleQuantityChange(index, -1, values, setFieldValue)}
														disabled={good?.quantity !== undefined && good?.quantity <= 1}
													/>
												</div>

												{/* Quantity display */}
												<div className='w-[40px] text-center'>
													<span>{good.quantity || 0}</span>
												</div>

												{/* Quantity increment button */}
												<div className='w-[30px] flex justify-center'>
													<Button
														type='button'
														label='+'
														onClick={() => handleQuantityChange(index, 1, values, setFieldValue)}
													/>
												</div>

												{/* Price per unit */}
												<div className='w-[100px] text-center'>
													<span>Ціна за 1: {good.price}</span>
												</div>

												{/* Total price for the item */}
												<div className='w-[120px] text-center'>
													<span>Ціна за Товар: {good.price * (good?.quantity || 1)}</span>
												</div>

												{/* Remove button */}
												<div className='flex-shrink-0'>
													<button
														type='button'
														onClick={() => {
															remove(index)
															const updatedTotal = calculateTotalPrice(values.orderedGoods)
															setFieldValue('totalPrice', updatedTotal)
														}}
														className='
				flex items-center justify-center
				bg-red-600 hover:bg-red-700 focus:bg-red-700
				text-white transition-all text-sm rounded-md py-2 px-3'
													>
														<Icon
															name='icon_trash'
															className='w-5 h-5 text-white hover:text-primaryAccentColor'
														/>
													</button>
												</div>
											</div>
										))}
									</div>
								)}
							/>
							<div className='flex justify-end'>
								<CustomButton
									type='submit'
									label={order ? 'Оновити замовлення' : 'Створити замовлення'}
									disabled={isLoading}
								/>
							</div>{' '}
							{/* Order status and submit button */}
							<div className='mt-4 text-lg font-semibold'>Загальна ціна: {totalPrice} грн</div>
						</>
					)
				}}
			</Formik>
		</div>
	)
}

export default OrderForm

// 'use client'

// import { getData } from '@/actions/nova'
// import orderFormSchema from '@/helpers/validationSchemas/orderFormShema'
// import { useAddData } from '@/hooks/useAddData'
// import { useUpdateData } from '@/hooks/useUpdateData'
// import { IOrder } from '@/types/index'
// import { PaymentMethod } from '@/types/paymentMethod'
// import { FieldArray, Formik, FormikState } from 'formik'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import React, { useEffect, useState } from 'react'
// import { toast } from 'sonner'
// import Button from '../Button'
// import { Icon } from '../Icon'
// import FormField from '../input/FormField'
// import CustomButton from './CustomFormikButton'

// interface InitialStateType extends Omit<IOrder, '_id'> {}

// interface ResetFormProps {
// 	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
// }

// interface OrderFormProps {
// 	order?: IOrder
// 	title?: string
// 	action: (values: IOrder) => Promise<{ success: boolean; message: string }>
// }

// const statusList = [
// 	{ id: 1, title: 'Новый' },
// 	{ id: 2, title: 'Опрацьовується' },
// 	{ id: 3, title: 'Оплачено' },
// 	{ id: 4, title: 'На відправку' },
// 	{ id: 5, title: 'Закритий' },
// ]

// const OrderForm: React.FC<OrderFormProps> = ({ order, action, title }) => {
// 	const [isLoading, setIsLoading] = useState(false)
// 	const [warehouses, setWarehouses] = useState<{ Ref: string; Description: string }[]>([])

// 	const { push } = useRouter()
// 	const isUpdating = Boolean(order?._id)
// 	const [name, surname] = order?.customer.name?.split(' ') || ['', '']

// 	const addOrderMutation = useAddData(action, 'orders')
// 	const updateOrderMutation = useUpdateData(action, 'orders')

// 	const customerInputs = [
// 		{
// 			name: 'customer.name',
// 			type: 'text',
// 			id: 'customer.name',
// 			label: `І'мя`,
// 			required: true,
// 		},
// 		{
// 			name: 'customer.surname',
// 			type: 'text',
// 			id: 'customer.surname',
// 			label: `Прізвище`,
// 			required: true,
// 		},
// 		{
// 			name: 'customer.email',
// 			type: 'email',
// 			id: 'customer.email',
// 			label: `Email`,
// 			required: true,
// 		},
// 		{
// 			name: 'customer.phone',
// 			type: 'tel',
// 			id: 'customer.phone',
// 			label: `Телефон`,
// 			required: true,
// 		},
// 		{
// 			name: 'customer.city',
// 			type: 'text',
// 			id: 'customer.city',
// 			label: `Місто`,
// 			required: true,
// 		},
// 		{
// 			id: 'customer.warehouse',
// 			label: 'Оберіть відділення',
// 			options: warehouses.map(warehouse => ({
// 				value: warehouse.Description,
// 				label: warehouse.Description,
// 			})),
// 			type: 'select',
// 		},
// 		{
// 			id: 'customer.payment',
// 			label: 'Оберіть спосіб оплати',
// 			options: Object.values(PaymentMethod).map(method => ({
// 				value: method,
// 				label: method,
// 			})),
// 			type: 'select',
// 		},
// 	]

// 	const initialValues: InitialStateType = {
// 		number: order?.number || '',
// 		customer: {
// 			name: name || '',
// 			surname: surname || '',
// 			email: order?.customer.email || '',
// 			phone: order?.customer.phone || '+380',
// 			city: order?.customer.city || '',
// 			warehouse: order?.customer.warehouse || 'Київ',
// 			payment: order?.customer.payment || PaymentMethod.CashOnDelivery,
// 		},
// 		orderedGoods: order?.orderedGoods || [
// 			{
// 				_id: '',
// 				category: '',
// 				src: [],
// 				brand: '',
// 				model: '',
// 				vendor: '',
// 				title: '',
// 				description: '',
// 				price: 0,
// 				isAvailable: false,
// 				isCompatible: false,
// 				compatibility: '',
// 				quantity: 0,
// 			},
// 		],
// 		totalPrice: order?.totalPrice || 0,
// 		status: order?.status || 'Новий',
// 	}
// 	const calculateTotalPrice = (goods: typeof initialValues.orderedGoods) => {
// 		return goods.reduce((total, good) => total + good.price * (good.quantity ?? 0), 0)
// 	}

// 	const handleQuantityChange = (
// 		index: number,
// 		change: number,
// 		values: InitialStateType,
// 		setFieldValue: any,
// 	) => {
// 		const newQuantity = Math.max((values.orderedGoods[index].quantity || 0) + change, 1)
// 		setFieldValue(`orderedGoods.${index}.quantity`, newQuantity)
// 		const updatedTotal = calculateTotalPrice(values.orderedGoods)
// 		setFieldValue('totalPrice', updatedTotal)
// 	}

// 	useEffect(() => {
// 		if (initialValues.customer.city) {
// 			fetchWarehouses(initialValues.customer.city)
// 		}
// 	}, [initialValues.customer.city])

// 	const fetchWarehouses = async (city: string) => {
// 		const request = {
// 			apiKey: process.env.NOVA_API,
// 			modelName: 'Address',
// 			calledMethod: 'getWarehouses',
// 			methodProperties: { CityName: city, Limit: '50', Language: 'UA' },
// 		}
// 		try {
// 			const response = await getData(request)
// 			setWarehouses(response.data.data || [])
// 		} catch (error) {
// 			console.error('Error fetching warehouses:', error)
// 		}
// 	}

// 	const handleSubmit = async (values: IOrder, { resetForm }: ResetFormProps) => {
// 		try {
// 			setIsLoading(true)

// 			const newOrderData = {
// 				...values,
// 				customer: {
// 					...values.customer,
// 					name: `${values.customer.name} ${values.customer.surname}`,
// 					warehouse: values.warehouse,
// 				},
// 			}

// 			let updateOrderData = {}

// 			if (isUpdating && order) {
// 				updateOrderData = {
// 					...values,
// 					_id: order._id,
// 					customer: {
// 						...values.customer,
// 						name: `${values.customer.name} ${values.customer.surname}`,
// 						warehouse: values.warehouse,
// 					},
// 				}
// 			}

// 			const result = isUpdating
// 				? await updateOrderMutation.mutateAsync(updateOrderData)
// 				: await addOrderMutation.mutateAsync(newOrderData)

// 			if (result?.success === false) {
// 				toast.error('Something went wrong')
// 				return
// 			}

// 			resetForm()
// 			toast.success(isUpdating ? 'Замовлення оновлено!' : 'Нове замовлення додано!')
// 			push('/admin/orders')
// 		} catch (error) {
// 			const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred'
// 			toast.error(errorMsg)
// 			console.error(error)
// 		} finally {
// 			setIsLoading(false)
// 		}
// 	}

// 	return (
// 		<div className='flex flex-col justify-center items-center p-4 bg-white rounded-lg shadow-md'>
// 			<h2 className='text-3xl mb-4 font-bold'>{title || 'Order Form'}</h2>
// 			<Formik
// 				initialValues={initialValues || []}
// 				onSubmit={handleSubmit}
// 				validationSchema={orderFormSchema}
// 			>
// 				{({ values, errors, setFieldValue }) => {
// 					useEffect(() => {
// 						const updatedTotal = calculateTotalPrice(values.orderedGoods)
// 						setFieldValue('totalPrice', updatedTotal)
// 					}, [values.orderedGoods, setFieldValue])

// 					useEffect(() => {
// 						if (values.customer.city) {
// 							fetchWarehouses(values.customer.city)
// 						}
// 					}, [values.customer.city])

// 					return (
// 						<>
// 							<h3 className='text-xl font-semibold'>Замовник</h3>
// 							{customerInputs.map((item, i) => (
// 								<FormField key={i} item={item} setFieldValue={setFieldValue} errors={errors} />
// 							))}
// 							<h3 className='text-xl font-semibold'>Товари у замовленні</h3>
// 							<FieldArray
// 								name='orderedGoods'
// 								render={({ remove }) => (
// 									<div>
// 										{values.orderedGoods.map((good, index) => (
// 											<div
// 												key={index}
// 												className='border p-4 mb-4 flex items-center gap-4 justify-between'
// 											>
// 												{/* Image container */}
// 												<div className='flex-shrink-0 w-[150px]'>
// 													<Image
// 														src={good.src[0] || '/placeholder.png'}
// 														alt='item_photo'
// 														width={150}
// 														height={150}
// 														className='object-cover'
// 													/>
// 												</div>

// 												{/* Item title */}
// 												<div className='flex-1 text-center'>
// 													<span>{good?.title || 'Unnamed Item'}</span>
// 												</div>

// 												{/* Quantity decrement button */}
// 												<div className='w-[30px] flex justify-center'>
// 													<Button
// 														type='button'
// 														label='-'
// 														onClick={() => handleQuantityChange(index, -1, values, setFieldValue)}
// 														disabled={
// 															values.orderedGoods?.[index]?.quantity !== undefined &&
// 															values.orderedGoods[index].quantity <= 1
// 														}
// 													/>
// 												</div>

// 												{/* Quantity display */}
// 												<div className='w-[40px] text-center'>
// 													<span>{good.quantity || 0}</span>
// 												</div>

// 												{/* Quantity increment button */}
// 												<div className='w-[30px] flex justify-center'>
// 													<Button
// 														type='button'
// 														label='+'
// 														onClick={() => handleQuantityChange(index, 1, values, setFieldValue)}
// 													/>
// 												</div>

// 												{/* Price per unit */}
// 												<div className='w-[100px] text-center'>
// 													<span>Ціна за 1: {good.price}</span>
// 												</div>

// 												{/* Total price for the item */}
// 												<div className='w-[120px] text-center'>
// 													<span>Ціна за Товар: {good.price * (good?.quantity || 1)}</span>
// 												</div>

// 												{/* Remove button */}
// 												<div className='flex-shrink-0'>
// 													<button
// 														type='button'
// 														onClick={() => {
// 															remove(index)
// 															const updatedTotal = calculateTotalPrice(values.orderedGoods)
// 															setFieldValue('totalPrice', updatedTotal)
// 														}}
// 														className='
// 				flex items-center justify-center
// 				bg-red-600 hover:bg-red-700 focus:bg-red-700
// 				text-white transition-all text-sm rounded-md py-2 px-3'
// 													>
// 														<Icon
// 															name='icon_trash'
// 															className='w-5 h-5 text-white hover:text-primaryAccentColor'
// 														/>
// 													</button>
// 												</div>
// 											</div>
// 										))}
// 									</div>
// 								)}
// 							/>
// 							<label className='text-xl font-semibold'>Статус замовлення</label>
// 							<FormField
// 								item={{
// 									id: 'status',
// 									type: 'select',
// 									required: true,
// 									options: statusList.map(status => ({
// 										value: status.title,
// 										label: status.title,
// 									})),
// 								}}
// 								errors={errors}
// 								setFieldValue={setFieldValue}
// 							/>
// 							<div className='flex justify-end'>
// 								<CustomButton
// 									type='submit'
// 									label={order ? 'Оновити замовлення' : 'Створити замовлення'}
// 									disabled={isLoading}
// 								/>
// 							</div>{' '}
// 							{/* Order status and submit button */}
// 							<div className='mt-4 text-lg font-semibold'>
// 								Загальна ціна: {values.totalPrice} грн
// 							</div>
// 						</>
// 					)
// 				}}
// 			</Formik>
// 		</div>
// 	)
// }

// export default OrderForm
