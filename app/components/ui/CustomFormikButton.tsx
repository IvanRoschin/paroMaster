import React from "react"

interface CustomFormikButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
  type = "submit", // пусть кнопка по умолчанию будет submit
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition  
        ${outline ? "bg-white text-orange-600" : "bg-orange-600 text-white"} 
        border-orange-600
        ${small ? "py-1 text-md font-light border-[1px] min-w-[40px]" : "py-3 text-md font-semibold border-2 w-full"}
      `}
      {...props}
    >
      {label}
    </button>
  )
}

export default CustomButton
