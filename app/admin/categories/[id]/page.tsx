import { getCategoryById, updateCategory } from "@/actions/categories"
import { CategoryForm } from "@/admin/components"

interface Params {
  id: string
}
const SingleCategoryPage = async ({ params }: { params: Params }) => {
  const { id } = params
  const category = await getCategoryById(id)
  return (
    <div className="mb-20">
      <CategoryForm title={"Редагувати категорію"} category={category} action={updateCategory} />
    </div>
  )
}

export default SingleCategoryPage
