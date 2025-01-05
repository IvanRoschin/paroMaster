"use client"
import { ErrorMessage, Field } from "formik"
import React from "react"

interface Option {
  value: string
  label: string
}

interface InputProps {
  item: {
    id: string
    as: string
    name: string
    label: string
    options: Option[]
  }
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  errors?: { [key: string]: string }
}

const SelectField: React.FC<InputProps> = ({ item, errors, setFieldValue }) => {
  return (
    <div className="w-full relative">
      <Field
        as={item.as}
        name={item.name}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setFieldValue(item.name, e.target.value === "true")
        }}
        className={`peer w-full p-4 mb-2 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed 
          ${errors?.[item.id] ? "border-rose-500" : "border-neutral-300"} 
          ${errors?.[item.id] ? "focus:border-rose-500" : "focus:border-green-500"}
        `}
      >
        {item.options.map((option, index) => (
          <option key={`${option.value}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
      <ErrorMessage name={item.name} render={msg => <div className="text-rose-500">{msg}</div>} />
      {/* <label className='absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3'>
					{item.label}
				</label> */}
    </div>
  )
}

export default SelectField
