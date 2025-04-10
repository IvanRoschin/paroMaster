import { FormikErrors } from "formik"
import { useState } from "react"
import { FaStar } from "react-icons/fa"

type Props = {
  errors?: FormikErrors<any>
  value: number | null
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  fieldName?: string
}

const Rating = ({ errors, value, setFieldValue, fieldName = "rating" }: Props) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const stars = Array(5).fill(0)

  const handleClick = (val: number) => {
    setFieldValue(fieldName, val)
  }

  const handleMouseOver = (val: number) => {
    setHoverValue(val)
  }

  const handleMouseLeave = () => {
    setHoverValue(null)
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">Оцініть товар</h2>
      <div className="flex space-x-1">
        {stars.map((_, i) => {
          const isActive = (hoverValue ?? value ?? 0) > i

          return (
            <FaStar
              key={i}
              className={`cursor-pointer transition-colors duration-200 ${
                isActive ? "text-[#FFBA5A]" : "text-gray-400"
              }`}
              size={24}
              onClick={() => handleClick(i + 1)}
              onMouseOver={() => handleMouseOver(i + 1)}
              onMouseLeave={handleMouseLeave}
            />
          )
        })}
      </div>
      {typeof errors?.[fieldName] === "string" && (
        <div className="text-sm text-red-500 mt-2">{errors[fieldName]}</div>
      )}
    </div>
  )
}

export default Rating
