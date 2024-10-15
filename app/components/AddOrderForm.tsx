'use client'

import { CustomButton, FormField } from '@/components/index'
import { orderFormSchema } from '@/helpers/index'
import { IGood } from '@/types/good/IGood'
import { IOrder } from '@/types/index'
import { PaymentMethod } from '@/types/paymentMethod'
import { Form, Formik, FormikState } from 'formik'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface InitialStateType extends Omit<IOrder, '_id'> {}

interface ResetFormProps {
	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface OrderFormProps {
	orderedGoods: IGood[]
	title?: string
	action: (data: FormData) => Promise<{ success: boolean; message: string }>
	orderNumber: string
	totalPrice: number
	goodsQuantity: number
}

const AddNewOrderForm: React.FC<OrderFormProps> = ({
	action,
	orderedGoods,
	title,
	orderNumber,
	totalPrice,
	goodsQuantity,
}) => {
	const [warehouses, setWarehouses] = useState<{ Ref: string; Description: string }[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	// const addOrderMutation = useAddData(action, 'orders')

	const initialValues: IOrder = {
		number: orderNumber,
		customer: {
			name: '',
			surname: '',
			email: '',
			phone: '+380',
			city: 'Київ',
			warehouse: '',
			payment: PaymentMethod.CashOnDelivery,
		},
		orderedGoods,
		totalPrice,
		status: 'Новий',
		goodsQuantity: goodsQuantity,
	}

	useEffect(() => {
		if (initialValues.customer.city) {
			fetchWarehouses(initialValues.customer.city)
		}
	}, [initialValues.customer.city])

	const fetchWarehouses = async (city: string) => {
		try {
			const request = {
				apiKey: process.env.NOVA_API,
				modelName: 'Address',
				calledMethod: 'getWarehouses',
				methodProperties: { CityName: city, Limit: '50', Language: 'UA' },
			}
			const response = await fetch('/api/nova', {
				method: 'POST',
				body: JSON.stringify(request),
			})
			const data = await response.json()
			setWarehouses(data?.data || [])
		} catch (error) {
			console.error('Error fetching warehouses:', error)
		}
	}

	const handleSubmit = async (values: InitialStateType, { resetForm }: ResetFormProps) => {
		try {
			setIsLoading(true)

			// Create FormData
			const formData = new FormData()
			Object.keys(values).forEach(key => {
				const value = (values as Record<string, any>)[key]
				if (Array.isArray(value)) {
					value.forEach(val => formData.append(key, val))
				} else {
					formData.append(key, value)
				}
			})

			// Perform the mutation (add or update)
			// const result = await addOrderMutation.mutateAsync(formData)
			await action(formData)
			// Handle result
			// if (!result?.success) {
			// 	toast.error(result.message || 'Error processing the order')
			// 	return
			// }

			// Success
			// .resetForm()
			toast.success('Order submitted successfully!')
			router.push('/')
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
		{ name: 'customer.name', type: 'text', id: 'name', label: `Ім'я`, required: true },
		{ name: 'customer.surname', type: 'text', id: 'surname', label: `Прізвище`, required: true },
		{ name: 'customer.email', type: 'email', id: 'email', label: `Email`, required: true },
		{ name: 'customer.phone', type: 'tel', id: 'phone', label: `Телефон`, required: true },
		{ name: 'customer.city', type: 'text', id: 'city', label: `Місто`, required: true },
		{
			name: 'customer.warehouse',
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
						<h3 className='text-xl font-semibold'>{title}</h3>
						{customerInputs.map((input, index) => (
							<FormField item={input} key={index} setFieldValue={setFieldValue} />
						))}
						<CustomButton label='Зберегти' disabled={isLoading} />
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default AddNewOrderForm
