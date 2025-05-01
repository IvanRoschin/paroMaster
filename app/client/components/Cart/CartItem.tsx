"use client"

import { useShoppingCart } from "app/context/ShoppingCartContext"
import Image from "next/image"
import { useEffect, useState } from "react"

import { Button, Icon } from "@/components/index"
import { IGood } from "@/types/index"

type CartItemProps = {
  good: IGood
  quantity: number
}

const CartItem: React.FC<CartItemProps> = ({ good, quantity }) => {
  const { increaseCartQuantity, decreaseCartQuantity, removeFromCart } = useShoppingCart()
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    if (good) {
      const newAmount = good.price * quantity
      setAmount(newAmount)
      sessionStorage.setItem(`amount-${good._id}`, JSON.stringify(newAmount))
    }
  }, [good, quantity])

  const { _id, title, price, src } = good

  return (
    <div>
      <li className="relative flex flex-col justify-between border border-gray-300 rounded-md p-4 hover:shadow-md transition-all mb-4">
        <div className="flex items-center justify-center gap-10 lg:gap-10">
          {/* Product Image */}
          <div className="w-[150px]">
            <Image
              src={src[0]}
              alt="item_photo"
              width={150}
              height={150}
              className="self-center"
              priority={true}
            />
          </div>

          {/* Product Title */}
          <p className="text-md">{title}</p>

          {/* Quantity Controls */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Button label="-" onClick={() => _id && decreaseCartQuantity(_id)} small outline />
              <span className="text-xl">{quantity}</span>
              <Button label="+" onClick={() => _id && increaseCartQuantity(_id)} small outline />
            </div>
            x <p>{price}</p>
          </div>

          {/* Total Amount */}
          <span>=</span>
          <p>{amount}</p>

          {/* Remove Item Button */}
          <button
            onClick={() => {
              _id && removeFromCart(_id)
              _id && sessionStorage.removeItem(`amount-${_id}`)
            }}
          >
            <Icon name="icon_trash" className="w-5 h-5 hover:text-primaryAccentColor" />
          </button>
        </div>
      </li>
    </div>
  )
}

export default CartItem
