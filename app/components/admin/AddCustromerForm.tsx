'use client'

import { getData } from '@/actions/nova'
import { customerFormSchema } from '@/helpers/index'
import { useAddData, useUpdateData } from '@/hooks/index'
import { ICustomer } from '@/types/customer/ICustomer'
import { PaymentMethod } from '@/types/paymentMethod'
import { FormikProvider, useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import FormField from '../input/FormField'
import CustomButton from './CustomFormikButton'

interface InitialStateType extends Omit<ICustomer, '_id'> {}

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
	payment: string
}

interface CustomerFormProps {
	customer?: ICustomer
	title?: string
	action: (values: ICustomer) => Promise<{ success: boolean; message: string }>
}

const AddCustomerForm: React.FC<CustomerFormProps> = ({
	customer,
	title = 'Додати замовника',
	action,
}) => {
	const [warehouses, setWarehouses] = useState<Warehouse[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const isUpdating = Boolean(customer?._id)

	const addCustomerMutation = useAddData(action, 'customers')
	const updateCustomerMutation = useUpdateData(action, 'customers')

	const [name, surname] = customer?.name?.split(' ') || ['', '']

	const formik = useFormik<FormValues>({
		initialValues: {
			name: name || '',
			surname: surname || '',
			email: customer?.email || '',
			phone: customer?.phone || '+380',
			payment: customer?.payment || PaymentMethod.CashOnDelivery,
			city: customer?.city || 'Київ',
			warehouse: customer?.warehouse || '',
		},
		validationSchema: customerFormSchema,
		onSubmit: async (values, { resetForm }) => {
			setIsLoading(true)
			const fullName = `${values.name} ${values.surname}`.trim()
			try {
				const newCustomerData = {
					...values,
					name: fullName,
				}

				const updateCustomerData = isUpdating ? { ...newCustomerData, _id: customer?._id } : {}

				// const formData = new FormData()
				// const fullName = `${values.name} ${values.surname}`.trim()
				// if (isUpdating && customer) {
				// 	formData.append('id', customer._id as string)
				// }
				// formData.append('name', fullName)
				// formData.append('email', values.email)
				// formData.append('phone', values.phone)
				// formData.append('city', values.city)
				// formData.append('warehouse', values.warehouse)
				// formData.append('payment', values.payment as string)

				if (isUpdating) {
					await updateCustomerMutation.mutateAsync(updateCustomerData)
				} else {
					await addCustomerMutation.mutateAsync(newCustomerData)
				}
				resetForm()
				toast.success(isUpdating ? 'Клієнта оновлено!' : 'Нового клієнта додано!')
			} catch (error) {
				console.error('Error in onSubmit:', error)
				toast.error('Помилка створення замовника')
			} finally {
				setIsLoading(false)
				router.push('/admin/customers')
			}
		},
	})

	const { values, handleSubmit, setFieldValue } = formik

	useEffect(() => {
		const fetchWarehouses = async () => {
			if (!values.city) {
				setWarehouses([])
				return
			}

			const request = {
				apiKey: process.env.NOVA_API,
				modelName: 'Address',
				calledMethod: 'getWarehouses',
				methodProperties: {
					CityName: values.city,
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

		fetchWarehouses()
	}, [values.city])

	const inputItems = [
		{ id: 'name', label: 'Ім`я', type: 'text', required: true },
		{ id: 'surname', label: 'Прізвище', type: 'text', required: true },
		{ id: 'email', label: 'Email', type: 'email', required: true },
		{ id: 'phone', label: 'Телефон', type: 'tel', required: true },
		{ id: 'city', label: 'Місто' },
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

	return (
		<div className='flex flex-col justify-center items-center'>
			<h2 className='text-4xl mb-4'>{title}</h2>
			<FormikProvider value={formik}>
				<form onSubmit={handleSubmit} autoComplete='off' className='flex flex-col space-y-8'>
					{inputItems.map(item => (
						<div key={item.id}>
							{item.type === 'select' && (
								<label htmlFor={item.id} className='block mb-2'>
									{item.label}
								</label>
							)}
							<FormField
								key={item.id}
								item={item}
								errors={formik.errors}
								setFieldValue={setFieldValue}
							/>
						</div>
					))}
					<CustomButton label='Зберегти' disabled={isLoading} />
				</form>
			</FormikProvider>
		</div>
	)
}

export default AddCustomerForm
