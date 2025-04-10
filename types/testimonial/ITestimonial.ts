export interface ITestimonial {
  createdAt: string | number | Date
  _id?: string
  name: string
  surname?: string
  text: string
  rating?: number | null
  isActive: boolean
  product: string
}
