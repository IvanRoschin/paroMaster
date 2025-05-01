import { getSlideById, updateSlide } from "@/actions/slider"
import { SlideForm } from "@/admin/components"

interface Params {
  id: string
}
const SingleSlidePage = async ({ params }: { params: Params }) => {
  const { id } = params
  const slide = await getSlideById(id)
  return (
    <div className="mb-20">
      <SlideForm title={"Редагувати слайд"} slide={slide} action={updateSlide} />
    </div>
  )
}

export default SingleSlidePage
