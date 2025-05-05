"use client"

import { useShoppingCart } from "app/context/ShoppingCartContext"
import { useMemo } from "react"

import storageKeys from "@/helpers/storageKeys"
import { ICartItem } from "@/types/index"

const WayForPayForm = () => {
  const { cart } = useShoppingCart()

  const getSavedFormData = () => {
    try {
      const savedData = sessionStorage.getItem(storageKeys.customer)
      if (savedData) return JSON.parse(savedData)
    } catch (error) {
      console.error("Помилка при читанні даних форми:", error)
    }
    return null
  }

  const savedFormData = getSavedFormData()

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item: ICartItem) => {
      return acc + (item.good.price || 0) * (item.quantity || 1)
    }, 0)
  }, [cart])

  const orderDate = Math.floor(Date.now() / 1000)
  const orderReference = `ORDER-${orderDate}`
  const signature = "0ceb3848ef50d22a201bf688b58ec343" // Поставити справжній підпис

  // Формуємо рядок товарів
  const productsString = cart
    .map(item =>
      [
        `${item.good.title} ${item.good.brand} ${item.good.model}`,
        item.good.price || 0,
        item.quantity || 1
      ].join("|")
    )
    .join(";")

  return (
    <form method="post" action="https://secure.wayforpay.com/pay" accept-charset="utf-8">
      <input hidden name="merchantAccount" value="test_merch_n1" />
      <input hidden name="merchantAuthType" value="SimpleSignature" />
      <input hidden name="merchantDomainName" value="www.market.ua" />
      <input hidden name="orderReference" value="DH1746169073" />
      <input hidden name="orderDate" value="1415379863" />
      <input hidden name="amount" value="1547.36" />
      <input hidden name="currency" value="UAH" />
      <input hidden name="orderTimeout" value="49000" />
      <input hidden name="productName[]" value="Парогенератор1" />
      <input hidden name="productName[]" value="Парогенератор2" />
      <input hidden name="productPrice[]" value="10" />
      <input hidden name="productPrice[]" value="547.36" />
      <input hidden name="productCount[]" value="1" />
      <input hidden name="productCount[]" value="3" />
      <input hidden name="clientFirstName" value="Іван" />
      <input hidden name="clientLastName" value="Рощин" />
      <input hidden name="clientAddress" value="пр. Науки, 12" />
      <input hidden name="clientCity" value="Дніпро" />
      <input hidden name="clientEmail" value="some@mail.com" />
      <input hidden name="defaultPaymentSystem" value="card" />
      <input hidden name="merchantSignature" value="3af7ec9d155df6f4fdeb5f9f870206a9" />
      <input type="submit" value="Test" />
    </form>
  )
}

export default WayForPayForm
