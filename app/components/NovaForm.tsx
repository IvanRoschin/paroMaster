import { getData } from '@/actions/nova'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import * as yup from 'yup'

interface Warehouse {
	Ref: string
	Description: string
}

const validationSchema = yup.object({
	city: yup
		.string()
		.matches(/^[\u0400-\u04FF\s]+$/, 'Підтримується пошук тільки українською мовою...')
		.required(`Поле "Назва" є обов'язковим`),
	warehouseId: yup.string().required('Поле "Відділення" є обов\'язковим'),
})

const NovaForm = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [warehouses, setWarehouses] = useState<Warehouse[]>([])

	const formik = useFormik({
		initialValues: {
			city: 'київ',
			warehouseId: '',
		},
		validationSchema: validationSchema,
		onSubmit: async values => {
			const body = {
				apiKey: '8d677609f6e47ce83929374b3afab572',
				modelName: 'AddressGeneral',
				calledMethod: 'searchSettlements',
				methodProperties: {
					CityName: values.city,
					Limit: '50',
					Language: 'UA',
				},
			}
			setIsLoading(true)
			try {
				const response = await getData(body)
				console.log('response', response)
				if (response && response.data.data) {
					setWarehouses(response.data.data)
				}
			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				setIsLoading(false)
			}
		},
	})

	useEffect(() => {
		const fetchWarehouses = async () => {
			if (!formik.values.city) {
				setWarehouses([])
				return
			}

			const body = {
				apiKey: '8d677609f6e47ce83929374b3afab572',
				modelName: 'Address',
				calledMethod: 'getWarehouses',
				methodProperties: {
					CityName: formik.values.city,
					Limit: '50',
					Language: 'UA',
				},
			}
			setIsLoading(true)
			try {
				const response = await getData(body)
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
	}, [formik.values.city])

	function setFieldValue(arg0: string, value: string) {
		throw new Error('Function not implemented.')
	}

	return (
		<div className='flex flex-col space-y-8'>
			<form onSubmit={formik.handleSubmit} autoComplete='off'>
				<div className='relative'>
					<input
						id='city'
						name='city'
						type='text'
						placeholder='Введіть назву міста'
						onChange={formik.handleChange}
						value={formik.values.city}
						onBlur={formik.handleBlur}
						className={`peer w-full h-10 p-6 bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed text-neutral-700 placeholder-white placeholder:b-black placeholder:text-base ${
							formik.errors.city && formik.touched.city ? 'border-rose-300' : 'border-neutral-300'
						} ${
							formik.errors.city && formik.touched.city
								? 'focus:border-rose-300'
								: 'focus:border-neutral-500'
						}`}
					/>

					{formik.errors.city && formik.touched.city && (
						<p className='text-rose-300 pl-7 transition-all'>{formik.errors.city}</p>
					)}
				</div>

				<div className='relative'>
					<select
						id='warehouseId'
						name='warehouseId'
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
							setFieldValue('warehouseId', e.currentTarget.value)
						}}
						onBlur={formik.handleBlur}
						value={formik.values.warehouseId}
						className={`peer w-full h-10 p-6 bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed text-neutral-700 placeholder-white placeholder:b-black placeholder:text-base ${
							formik.errors.warehouseId && formik.touched.warehouseId
								? 'border-rose-300'
								: 'border-neutral-300'
						} ${
							formik.errors.warehouseId && formik.touched.warehouseId
								? 'focus:border-rose-300'
								: 'focus:border-neutral-500'
						}`}
					>
						<option value='' label='Оберіть відділення' />
						{warehouses.map(warehouse => (
							<option key={warehouse.Ref} value={warehouse.Ref}>
								{warehouse.Description}
							</option>
						))}
					</select>
					<label
						htmlFor='warehouseId'
						className='absolute left-0 p-2 pl-7 -top-8 text-neutral-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500 peer-placeholder-shown:top-2 transition-all'
					>
						Оберіть відділення
					</label>
					{formik.errors.warehouseId && formik.touched.warehouseId && (
						<p className='text-rose-300 pl-7 transition-all'>{formik.errors.warehouseId}</p>
					)}
				</div>
			</form>
		</div>
	)
}

export default NovaForm
