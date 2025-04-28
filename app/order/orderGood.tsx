import { IGood } from "@/types/index"
import Image from "next/image"
import React from "react"

type CartItemProps = {
  good: IGood
  quantity: number
}

const OrderGood: React.FC<CartItemProps> = ({ good, quantity }) => {
  if (!good) {
    return
  }
  const { _id, title, price, src } = good

  const totalPrice = price * quantity

  return (
    <div>
      <li className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2 hover:shadow-sm transition-all mb-2">
        <div className="flex items-center gap-2 w-2/3">
          {/* Product Image */}
          <Image
            src={src[0]}
            alt={title}
            width={40}
            height={40}
            className="w-10 h-10 object-cover rounded-md"
          />
          {/* Product Title */}
          <p className="text-xs font-medium text-gray-800 truncate">{title}</p>
        </div>

        <div className="flex flex-col items-end w-1/3">
          <div className="flex text-xs text-gray-600">
            <span className="font-medium">Ціна:</span> {price} грн
          </div>
          <div className="flex text-xs text-gray-600">
            <span className="font-medium">Кількість:</span> {quantity}
          </div>
          <div className="flex text-xs font-semibold text-primaryAccentColor">
            <span className="font-medium">Вартість:</span> {totalPrice} грн
          </div>
        </div>
      </li>
    </div>
  )
}

export default OrderGood
