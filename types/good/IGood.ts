export interface IGoods {}

export interface IGood {
  _id?: string
  category: string
  src: string[]
  brand: string
  model: string
  vendor: string
  title: string
  description: string
  price: number
  isCondition: boolean
  isAvailable: boolean
  isCompatible: boolean
  compatibility: string[]
  quantity?: number
  averageRating?: number
  ratingCount?: number
}

export interface SGood {
  quantity: number
  _id: string
  category: string
  src: string[]
  brand: string
  model: string
  vendor: string
  title: string
  description: string
  price: number
  isCondition: boolean
  isAvailable: boolean
  isCompatible: boolean
  compatibility: string[]
}
