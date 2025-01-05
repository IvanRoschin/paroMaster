"use client"

import { ErrorMessage, Field } from "formik"

interface InputProps {
  item: {
    id: string
    name?: string
    label: string
    type?: string
    value?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
  }
  errors?: { [key: string]: string }
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void
}

const Input: React.FC<InputProps> = ({ item, errors, setFieldValue }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (setFieldValue) {
      setFieldValue(item.id, e.target.value)
    }
  }

  console.log("errors", errors)
  return (
    <div className="w-full relative">
      <Field
        name={item.name}
        disabled={item.disabled}
        type={item.type}
        onChange={handleChange}
        className={`peer w-full p-4 mb-2 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed 
				${errors?.[item.id] ? "border-rose-500" : "border-neutral-300"} 
				${errors?.[item.id] ? "focus:border-rose-500" : "focus:border-green-500"}
				`}
      />
      <ErrorMessage name={item.id} render={msg => <div className="text-rose-500">{msg}</div>} />
      <label
        className="
			absolute
			text-md 
			duration-150
			left-3
			top-5
			z-10 origin-[0]
			transform -translate-y-3
			peer-placeholder-shown:scale-100 
			peer-placeholder-shown:translate-y-0 
			peer-focus:scale-75
			peer-focus:-translate-y-3
			"
      >
        {item.label}
      </label>
    </div>
  )
}

export default Input
