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

  const getDisplayValue = () => hoverValue ?? value ?? 0

  const handleClick = (val: number) => {
    setFieldValue(fieldName, val)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - left
    const percent = x / width
    const hoverVal = percent < 0.5 ? index + 0.5 : index + 1
    setHoverValue(hoverVal)
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">Оцініть товар</h2>
      <div className="flex space-x-1">
        {stars.map((_, i) => {
          const displayValue = getDisplayValue()
          const full = i + 1 <= displayValue
          const half = !full && i + 0.5 <= displayValue

          return (
            <div
              key={i}
              className="relative cursor-pointer"
              onMouseMove={e => handleMouseMove(e, i)}
              onMouseLeave={() => setHoverValue(null)}
              onClick={e => {
                const { left, width } = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - left
                const percent = x / width
                const clickedValue = percent < 0.5 ? i + 0.5 : i + 1
                handleClick(clickedValue)
                console.log("clickedValue", clickedValue)
              }}
            >
              <FaStar
                size={24}
                className={`transition-colors duration-200 ${
                  full ? "text-[#FFBA5A]" : half ? "text-[#FFBA5A] clip-half" : "text-gray-400"
                }`}
              />
            </div>
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
