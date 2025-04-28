"use client"

import { storageKeys } from "@/helpers/storageKeys"
import { useShoppingCart } from "app/context/ShoppingCartContext"
import { useEffect, useState } from "react"
import Button from "../ui/Button"
import CartItem from "./CartItem"

export const CartClient = ({
  onConfirm,
  onCancel
}: {
  onConfirm: () => void
  onCancel: () => void
  title?: string
}) => {
  const { cart } = useShoppingCart()
  const [amounts, setAmounts] = useState<number[]>([])

  useEffect(() => {
    const retrievedAmounts = cart.map(({ good }) => {
      const storedAmount = localStorage.getItem(`amount-${good._id}`)
      return storedAmount ? JSON.parse(storedAmount) : 0
    })
    setAmounts(retrievedAmounts)
  }, [cart])

  const totalAmount = amounts.reduce((total, amount) => total + amount, 0)

  useEffect(() => {
    sessionStorage.setItem(storageKeys.totalPrice, JSON.stringify(totalAmount))
  }, [totalAmount])

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">🛍️ Товари у замовленні</h2>

      <div className="space-y-4">
        {cart.map((item, indx) => (
          <CartItem key={indx} quantity={item.quantity} good={item.good} />
        ))}
      </div>

      <div className="border-t pt-6 space-y-2 text-right text-gray-700">
        <p className="text-lg">
          Всього за замовленням: <span className="font-bold text-gray-900">{totalAmount} грн</span>
        </p>
        <p className="text-sm italic">
          {totalAmount >= 1000
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
