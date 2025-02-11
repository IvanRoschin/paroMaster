import { CartItem } from "../cart/ICartItem"

export interface IOrder {
  _id?: string
  number: string
  customer: {
    name: string
    surname?: string
    phone: string
    email: string
    city: string
    warehouse: string
    payment: string
    [key: string]: any
  }
  warehouse?: string
  orderedGoods: CartItem[]
  totalPrice: number
  status: string
}
