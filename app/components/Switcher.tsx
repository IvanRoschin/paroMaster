import React from 'react'

interface SwitcherProps {
	id?: string
	label?: string
	checked: boolean
	onChange: (checked: boolean) => void
}

const Switcher: React.FC<SwitcherProps> = ({ id, label, checked, onChange }) => {
	const handleToggle = () => {
		onChange(!checked)
	}

	return (
		<div className='flex items-center mb-4'>
			<label htmlFor={id} className='mr-2'>
				{label}
			</label>
			<div className='relative'>
				<div
					onClick={handleToggle}
					className={`block w-14 h-8 rounded-full cursor-pointer transition-colors ${
						checked ? 'bg-primaryAccentColor' : 'bg-gray-300'
					}`}
				></div>
				<div
					className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
						checked ? 'translate-x-6' : ''
					}`}
					onClick={handleToggle}
				></div>
			</div>
		</div>
	)
}

export default Switcher
