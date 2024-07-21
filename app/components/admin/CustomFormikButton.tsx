import { useFormikContext } from 'formik'

interface CustomFormikButtonProps {
	label: string
	disabled?: boolean
	outline?: boolean
	small?: boolean
}

const CustomButton: React.FC<CustomFormikButtonProps> = ({
	label,
	disabled,
	outline,
	small,
	...props
}) => {
	const { submitForm } = useFormikContext()

	return (
		<button
			type='button'
			onClick={submitForm}
			disabled={disabled}
			className={`relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition  ${
				outline ? 'bg-white' : 'bg-orange-600'
			} 
      ${outline ? 'border-orange-600' : 'border-orange-600'} 
      ${outline ? 'border-orange-600' : 'text-white'} 
      ${small ? 'py-1' : 'py-3'} 
      ${small ? 'text-md' : 'text-md'} 
      ${small ? 'font-light' : 'font-semibold'} 
      ${small ? 'border-[1px]' : 'border-2'}
      ${small ? 'w-[40px]' : 'w-full'}
        `}
			{...props}
		>
			{label}
		</button>
	)
}

export default CustomButton
