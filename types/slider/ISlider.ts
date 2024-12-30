export interface ISlider {
  _id?: string
  title: string
  desc: string
  src: string
}

export interface IGetAllSlidersResponse {
  success: boolean
  count: number
  sliders: ISlider[]
}
