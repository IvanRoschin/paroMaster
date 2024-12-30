import { getTestimonialById, updateTestimonial } from "@/actions/testimonials"
import { TestimonialForm } from "@/components/index"

interface Params {
  id: string
}

const SingleTestimonailPage = async ({ params }: { params: Params }) => {
  const { id } = params
  const testimonial = await getTestimonialById(id)

  return (
    <div className="mb-20">
      <TestimonialForm
        testimonial={testimonial}
        title={"Редагувати відгук"}
        action={updateTestimonial}
      />
    </div>
  )
}

export default SingleTestimonailPage
