"use client"

import { getGoodById } from "@/actions/goods"
import { SGood } from "@/types/good/IGood"
import { useShoppingCart } from "app/context/ShoppingCartContext"
import Image from "next/image"
import { useEffect, useState } from "react"
import useSWR from "swr"
import Button from "../Button"
import { Icon } from "../Icon"
import Loader from "../Loader"

type CartItemProps = {
  id: string
  quantity: number
}

const CartItem: React.FC<CartItemProps> = ({ id, quantity }) => {
  const { increaseCartQuantity, decreaseCartQuantity, removeFromCart } = useShoppingCart()
  const { data, error } = useSWR<SGood>(`data-${id}`, () => getGoodById(id))
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    if (data) {
      const newAmount = data.price * quantity
      setAmount(newAmount)
      localStorage.setItem(`amount-${id}`, JSON.stringify(newAmount))
    }
  }, [data, id, quantity])

  if (error) return <p>Error loading item.</p>
  if (!data) return <Loader />

  const { _id, title, price, src } = data

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
              <Button label="-" onClick={() => decreaseCartQuantity(_id)} small outline />
              <span className="text-xl">{quantity}</span>
              <Button label="+" onClick={() => increaseCartQuantity(_id)} small outline />
            </div>
            x <p>{price}</p>
          </div>

          {/* Total Amount */}
          <span>=</span>
          <p>{amount}</p>

          {/* Remove Item Button */}
          <button
            onClick={() => {
              removeFromCart(_id)
              localStorage.removeItem(`amount-${id}`)
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
