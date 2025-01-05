import { IGetAllTestimonials } from "@/actions/testimonials"
import Slider from "./Slider"

const TestimonialsList = ({
  testimonialsData,
  title
}: {
  testimonialsData: IGetAllTestimonials
  title?: string
}) => {
  return (
    <>
      <h2 className="subtitle-main">{title}</h2>
      <div className="flex flex-wrap justify-center">
        <Slider testimonialsData={testimonialsData} testimonials />
      </div>
    </>
  )
}

export default TestimonialsList
