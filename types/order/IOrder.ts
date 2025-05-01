import { IGood } from "../good/IGood"

export interface IOrder {
  _id?: string
  number: string
  customer: {
    name: string
    surname: string
    email: string
    phone: string
    city: string
    warehouse: string
    payment: string
  }
  orderedGoods: IGood[]
  totalPrice: number
  status: "Новий" | "Опрацьовується" | "Оплачений" | "На відправку" | "Закритий"
  createdAt?: string
  updatedAt?: string
}
