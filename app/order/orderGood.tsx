import { IGood } from "@/types/index"
import React from "react"

type CartItemProps = {
  good: IGood
  quantity: number
}

const OrderGood: React.FC<CartItemProps> = ({ good, quantity }) => {
  const { _id, title, price, src } = good

  return (
    <div>
      <li className="relative flex flex-col justify-between border border-gray-300 rounded-md p-4 hover:shadow-md transition-all mb-4">
        <div className="flex items-center justify-start gap-10 lg:gap-10">
          {/* Product Title */}
          <p className="text-md">{title}</p> <p className="text-md">{price}</p> x{" "}
          <p className="text-md">{quantity}</p> = {price * quantity}
        </div>
      </li>
    </div>
  )
}

export default OrderGood
