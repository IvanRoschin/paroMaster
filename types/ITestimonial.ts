export interface ITestimonial {
  _id?: string
  name: string
  surname?: string
  text: string
  rating?: number | null
  isActive: boolean
  product?: string
  createdAt: string | number | Date
}
