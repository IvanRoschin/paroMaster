import { getCategoryById, updateCategory } from "@/actions/categories"
import { CategoryForm } from "@/admin/components"
import { ISearchParams } from "@/types/searchParams"

const SingleCategoryPage = async ({ searchParams }: { searchParams: Promise<ISearchParams> }) => {
  const params = await searchParams

  const { id } = params
  const category = await getCategoryById(id)
  return (
    <div className="mb-20">
      <CategoryForm title={"Редагувати категорію"} category={category} action={updateCategory} />
    </div>
  )
}

export default SingleCategoryPage
