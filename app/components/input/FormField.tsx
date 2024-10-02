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
		name?: string
	}
	errors?: { [key: string]: string | string[] | FormikErrors<any> | FormikErrors<any>[] }
	setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void
}

const FormField: React.FC<FormFieldProps> = ({ item, errors, setFieldValue }) => {
	const [, meta] = useField(item.id)

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		if (setFieldValue) {
			setFieldValue(item.id, e.target.value)
		}
	}

	return (
		<div className='w-full relative mb-4'>
			{item.options ? (
				<Field
					as='select'
					id={item.id}
					name={item.name || item.id} // Ensure name is correct
					className={`peer w-full p-4 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed 
					${meta.error && meta.touched ? 'border-rose-500' : 'border-neutral-300'} 
					${meta.error && meta.touched ? 'focus:border-rose-500' : 'focus:border-green-500'}
					`}
					onChange={handleChange}
				>
					{item.options.map((option, index) => (
						<option key={index} value={option.value}>
							{option.label}
						</option>
					))}
				</Field>
			) : item.type === 'textarea' ? (
				<div className='relative'>
					<Field
						as='textarea'
						name={item.id}
						disabled={item.disabled}
						className={`text-primaryTextColor peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed 
					${meta.error && meta.touched ? 'border-rose-500' : 'border-neutral-300'} 
					${meta.error && meta.touched ? 'focus:border-rose-500' : 'focus:border-green-500'}
					`}
						style={item.style} // Apply any additional styles from `item`
					/>
					{/* <label
						className='text-primaryTextColor absolute text-md duration-150 left-3 top-5 z-10 origin-[0] transform -translate-y-3
				peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3'
					>
						{item.label}
					</label> */}
				</div>
			) : (
				<Field
					as={item.as || 'input'} // Ensure default as 'input' if not specified
					name={item.name || item.id} // Ensure name is correct
					type={item.type}
					disabled={item.disabled}
					className={`text-primaryTextColor peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed 
					${meta.error && meta.touched ? 'border-rose-500' : 'border-neutral-300'} 
					${meta.error && meta.touched ? 'focus:border-rose-500' : 'focus:border-green-500'}
					`}
					style={item.style} // Apply any additional styles from `item`
				/>
			)}
			<label
				className={`
    ${
			item.type === 'select'
				? 'hidden'
				: 'text-primaryTextColor absolute text-md duration-150 left-3 top-5 z-10 origin-[0] transform -translate-y-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3'
		}
  `}
			>
				{item.label}
			</label>
			<ErrorMessage name={item.id} component='div' className='text-rose-500' />
		</div>
	)
}

export default FormField
