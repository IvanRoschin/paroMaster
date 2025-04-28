import { IGood } from "../good/IGood"

export type CartItem = {
  good: IGood
  quantity: number
  _id?: string
  category?: string
  src: string[]
  brand?: string
  model?: string
  vendor?: string
  title: string
  description?: string
  price: number
  isAvailable?: boolean
  isCompatible?: boolean
  compatibility?: string
}
