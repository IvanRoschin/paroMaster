import { addTestimonial } from "@/actions/testimonials"
import { TestimonialForm } from "@/admin/components"

const AddTestimonialPage = () => {
  return (
    <div className="mb-20">
      <TestimonialForm title="Додати новий відгук" action={addTestimonial} />
    </div>
  )
}

export default AddTestimonialPage
