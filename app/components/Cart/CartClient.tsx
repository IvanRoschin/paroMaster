"use client"

import { storageKeys } from "@/helpers/storageKeys"
import { useShoppingCart } from "app/context/ShoppingCartContext"
import { useEffect, useState } from "react"
import CartItem from "./CartItem"

type Props = {}

export const CartClient = (props: Props) => {
  const { cart } = useShoppingCart()
  const [amounts, setAmounts] = useState<number[]>([])

  useEffect(() => {
    const retrievedAmounts = cart.map(item => {
      const storedAmount = sessionStorage.getItem(`amount-${item.good._id}`)
      return storedAmount ? JSON.parse(storedAmount) : 0
    })
    setAmounts(retrievedAmounts)
  }, [cart])

  const totalAmount = amounts.reduce((total, amount) => total + amount, 0)

  useEffect(() => {
    sessionStorage.setItem(storageKeys.totalPrice, JSON.stringify(totalAmount))
  }, [totalAmount])

  return (
    <div>
      <h2 className="text-2xl">Товари у замовленні</h2>
      {cart.map((item, indx) => (
        <CartItem key={indx} quantity={item.quantity} good={item.good} />
      ))}
      <p className="text-end pt-10">
        Всього за замовленням: <span className="font-bold">{totalAmount} грн.</span>
      </p>
      <p className="text-end pt-10">
        {totalAmount >= 1000
          ? `доставка безкоштовна`
          : `вартість доставки: за тарифами перевізника`}
      </p>
      {/* <br />+ вартість доставки: <span className="font-bold"> за тарифами перевізника</span> */}
    </div>
  )
}

export default CartClient
