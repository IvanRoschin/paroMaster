"use client"

import { IGood } from "@/types/good/IGood"
import { useShoppingCart } from "app/context/ShoppingCartContext"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaPen } from "react-icons/fa"
import Button from "../ui/Button"

interface ItemListCardProps {
  item: IGood
}

const ItemListCard: React.FC<ItemListCardProps> = ({ item }) => {
  const { data: session } = useSession()

  const isAdmin = session?.user

  const [amount, setAmount] = useState(0)

  const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart } =
    useShoppingCart()

  const quantity = getItemQuantity(item._id!)

  useEffect(() => {
    const newAmount = item.price * quantity
    setAmount(newAmount)
    localStorage.setItem(`amount-${item._id}`, JSON.stringify(newAmount))
  }, [item.price, item._id, quantity])

  return (
    <li className="flex flex-col justify-between border border-gray-300 rounded-md p-4 hover:shadow-[10px_10px_15px_-3px_rgba(0,0,0,0.3)] transition-all">
      <div className="relative">
        <Link href={`/good/${item._id}`} className="flex flex-col h-full justify-between">
          <div className="w-[200px] h-[200px]">
            <div className="absolute top-2 left-2 bg-primaryAccentColor text-white text-xs font-semibold px-2 py-1 rounded">
              {item.isCondition ? "НОВИЙ" : "Б/У"}
            </div>{" "}
            <Image
              src={item.src[0]}
              alt="item_photo"
              width={200}
              height={200}
              className="self-center mb-[30px]"
            />
          </div>
          {/* Рейтинг і кількість відгуків */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>{index < Math.round(item.averageRating || 0) ? "★" : "☆"}</span>
              ))}
            </div>
            <span className="text-sm text-gray-600">({item.ratingCount || 0} відгуків)</span>
          </div>
          <h2 className="font-semibold mb-[20px]">{item.title}</h2>
          <div>
            <p className={`mb-[20px] ${item.isAvailable ? "text-green-600" : "text-red-600"}`}>
              {item.isAvailable ? "В наявності" : "Немає в наявності"}
            </p>
            <p className="mb-[20px]">Артикул: {item.vendor}</p>
            <p className="text-2xl font-bold mb-[20px]">{item.price} грн</p>
          </div>
        </Link>
        {isAdmin && (
          <Link
            href={`/admin/goods/${item._id}`}
            className="absolute top-0 right-0 flex items-center justify-center"
          >
            <span className="cursor-pointer w-[30px] h-[30px] rounded-full bg-orange-600 flex justify-center items-center hover:opacity-80">
              <FaPen size={12} color="white" />
            </span>
          </Link>
        )}
      </div>

      <CartActions
        isAvailable={item.isAvailable}
        itemId={item._id!}
        quantity={quantity}
        increaseCartQuantity={increaseCartQuantity}
        decreaseCartQuantity={decreaseCartQuantity}
        removeFromCart={removeFromCart}
      />

      {/* <ItemDetails item={item} /> */}
    </li>
  )
}

interface CartActionsProps {
  isAvailable: boolean
  itemId: string
  quantity: number
  increaseCartQuantity: (id: string) => void
  decreaseCartQuantity: (id: string) => void
  removeFromCart: (id: string) => void
}

const CartActions: React.FC<CartActionsProps> = ({
  isAvailable,
  itemId,
  quantity,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeFromCart
}) => {
  return (
    <div>
      {quantity === 0 ? (
        <Button
          type="button"
          label="Купити"
          disabled={isAvailable === false}
          onClick={() => increaseCartQuantity(itemId)}
        />
      ) : (
        <div className="flex items-center flex-col gap-10">
          <div className="flex items-center justify-center gap-20">
            <div className="flex items-center justify-between gap-2">
              <Button
                width="40"
                type="button"
                label="-"
                onClick={() => decreaseCartQuantity(itemId)}
                small
                outline
              />
              <span className="text-xl">{quantity}</span>в корзині
              <Button
                width="40"
                type="button"
                label="+"
                onClick={() => increaseCartQuantity(itemId)}
                small
                outline
              />
            </div>
          </div>
          <Button
            width="40"
            type="button"
            label="Видалити"
            onClick={() => {
              removeFromCart(itemId)
              localStorage.removeItem(`amount-${itemId}`)
            }}
          />
        </div>
      )}
    </div>
  )
}

interface ItemDetailsProps {
  item: IGood
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item }) => {
  return (
    <>
      <p className="font-light text-gray-500">
        Сумісність з брендами: {item.isCompatible ? "так" : "ні"}
      </p>
      <p className="font-light text-gray-500">Brand: {item.brand}</p>
      <p className="font-light text-gray-500">Model: {item.model}</p>
      <p className="font-light text-gray-500">Сумісність з брендами: {item.compatibility}</p>
    </>
  )
}

export default ItemListCard
