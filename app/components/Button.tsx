'use client'

import { IconType } from 'react-icons'

interface ButtonProps {
	label?: string
	type: string
	onClick?: () => void
	disabled?: boolean
	outline?: boolean
	small?: boolean
	icon?: IconType
	color?: string
	width?: string
}

const Button: React.FC<ButtonProps> = ({
	label,
	onClick,
	disabled,
	outline,
	small,
	color,
	width,
	icon: Icon,
}) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={` 
				flex items-center justify-center
				disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition
			${small && color ? `${color}` : 'bg-orange-600'} 
			${outline ? 'bg-white' : 'bg-orange-600'} 
      ${outline ? 'border-orange-600' : 'border-orange-600'} 
      ${outline ? 'border-orange-600' : 'text-white'} 
      ${small ? 'py-[2px]' : 'py-2'} 
			${small ? 'px-1' : 'px-2'}
      ${small ? 'text-md' : 'text-md'} 
      ${small ? 'border-[1px]' : 'border-2'}
      ${small && width ? `w-[${width}px]` : 'w-full'}
      `}
		>
			{Icon && <Icon size={12} className=' ' />}
			{label}
		</button>
	)
}

export default Button
