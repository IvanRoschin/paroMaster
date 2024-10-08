'use client'

import { getData } from '@/actions/nova'
import { ICustomer } from '@/types/customer/ICustomer'
import { PaymentMethod } from '@/types/paymentMethod'
import { customerFormSchema } from 'app/helpers/validationShemas'
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
	action: (
		data: FormData,
	) => Promise<{
		success: boolean
		data: {
			name: FormDataEntryValue
			phone: FormDataEntryValue
			email: FormDataEntryValue
			city: FormDataEntryValue
			warehouse: FormDataEntryValue
			payment: FormDataEntryValue
		}
	}>
}

const AddCustomerForm: React.FC<CustomerFormProps> = ({
	customer,
	title = 'Додати замовника',
	action,
}) => {
	const [warehouses, setWarehouses] = useState<Warehouse[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const formik = useFormik<FormValues>({
		initialValues: {
			name: customer?.name || '',
			surname: '',
			email: customer?.email || '',
			phone: customer?.phone || '+380',
			payment: customer?.payment || PaymentMethod.CashOnDelivery,
			city: customer?.city || 'Київ',
			warehouse: customer?.warehouse || '',
		},
		validationSchema: customerFormSchema,
		onSubmit: async (values, { resetForm }) => {
			setIsLoading(true)
			try {
				const formData = new FormData()
				const fullName = `${values.name} ${values.surname}`.trim()
				{
					customer && formData.append('id', customer._id as string)
				}
				formData.append('name', fullName)
				formData.append('email', values.email)
				formData.append('phone', values.phone)
				formData.append('city', values.city)
				formData.append('warehouse', values.warehouse)
				formData.append('payment', values.payment as string)

				await action(formData)

				resetForm()
				toast.success(customer?._id ? 'Клієнта оновлено!' : 'Нового клієнта додано!')
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
				console.error('Error fetching warehouses:', error)
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
