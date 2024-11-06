'use client'

import { ErrorMessage, Field, FormikErrors, useField } from 'formik'

interface Option {
	value: string
	label: string
}

interface FormFieldProps {
	item: {
		as?: string
		id: string
		label?: string
		type?: string
		value?: string
		disabled?: boolean
		required?: boolean
		options?: Option[]
		style?: React.CSSProperties
	}
	errors?: { [key: string]: string | string[] | FormikErrors<any> | FormikErrors<any>[] }
	setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void
}

const FormField: React.FC<FormFieldProps> = ({ item, errors, setFieldValue }) => {
	const [, meta] = useField(item.id)

	return (
		<div className='w-full relative mb-4'>
			{item.options ? (
				<>
					<Field
						as='select'
						name={item.id}
						className={`peer w-full p-4 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
            ${meta.error && meta.touched ? 'border-rose-500' : 'border-neutral-300'}
            ${meta.error && meta.touched ? 'focus:border-rose-500' : 'focus:border-green-500'}
            `}
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
							setFieldValue && setFieldValue(item.id, e.target.value)
						}}
					>
						{item.options.map((option, index) => (
							<option key={index} value={option.value}>
								{option.label}
							</option>
						))}
					</Field>
				</>
			) : item.type === 'textarea' ? (
				<div className='relative'>
					<Field
						as='textarea'
						name={item.id}
						disabled={item.disabled}
						className={`peer w-full p-4 font-light bg-white border-2 rounded-md outline-none transition
            ${meta.error && meta.touched ? 'border-rose-500' : 'border-neutral-300'}
            ${meta.error && meta.touched ? 'focus:border-rose-500' : 'focus:border-green-500'}
            disabled:opacity-70 disabled:cursor-not-allowed resize-none`} // Added `resize-none` to prevent resizing
						style={item.style} // Apply any additional styles from `item`
					/>
					<label
						className='text-primaryTextColor absolute text-md duration-150 left-3 top-5 z-10 origin-[0] transform -translate-y-3
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3'
					>
						{item.label}
					</label>
				</div>
			) : (
				<>
					<Field
						as={item.as}
						name={item.id}
						type={item.type}
						disabled={item.disabled}
						className={`text-primaryTextColor peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
            ${meta.error && meta.touched ? 'border-rose-500' : 'border-neutral-300'}
            ${meta.error && meta.touched ? 'focus:border-rose-500' : 'focus:border-green-500'}
            `}
					/>
					<label
						className='text-primaryTextColor absolute text-md duration-150 left-3 top-5 z-10 origin-[0] transform -translate-y-3
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3'
					>
						{item.label}
					</label>
				</>
			)}
			<ErrorMessage name={item.id} component='div' className='text-rose-500' />
		</div>
	)
}

export default FormField
