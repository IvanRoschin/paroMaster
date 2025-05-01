"use client"

import { useEffect, useMemo } from "react"

import { Button, CartItem } from "@/components/index"
import { storageKeys } from "@/helpers/index"
import { ICartItem } from "@/types/cart/ICartItem"

export const CartClient = ({
  onConfirm,
  onCancel
}: {
  onConfirm: () => void
  onCancel: () => void
  title?: string
}) => {
  const { cart } = useShoppingCart()

  const totalPrice = useMemo(() => {
    return cart.reduce((acc: number, item: ICartItem) => {
      return acc + (item.good.price || 0) * (item.quantity || 1)
    }, 0)
  }, [cart])

  useEffect(() => {
    sessionStorage.setItem(storageKeys.totalPrice, JSON.stringify(totalPrice))
  }, [totalPrice])

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">🛍️ Товари у замовленні</h2>

      <div className="space-y-4">
        {cart.map((item: ICartItem, i: number) => (
          <CartItem key={i} quantity={item.quantity} good={item.good} />
        ))}
      </div>

      <div className="border-t pt-6 space-y-2 text-right text-gray-700">
        <p className="text-lg">
          Всього за замовленням: <span className="font-bold text-gray-900">{totalPrice} грн</span>
        </p>
        <p className="text-sm italic">
          {totalPrice >= 1000
            ? "🚚 Доставка безкоштовна"
            : "🚚 Вартість доставки: за тарифами перевізника"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4">
        <Button type="button" label="Продовжити покупки" onClick={onCancel} small outline />
        <Button type="button" label="Оформити замовлення" onClick={onConfirm} small />
      </div>
    </div>
  )
}

export default CartClient
function useShoppingCart(): { cart: any } {
  throw new Error("Function not implemented.")
}
