import { getAllCategories } from "@/actions/categories"
import { ICategory } from "@/types/index"
import { useFetchData } from "../hooks"

export const useCategoriesEnum = () => {
  const { data, isLoading, isError } = useFetchData(getAllCategories, ["categories"], {
    limit: 100,
    page: 1
  })

  const allowedCategories = data?.categories?.map((cat: ICategory) => cat.title) ?? []

  return {
    categories: data?.categories ?? [],
    allowedCategories,
    isLoading,
    isError
  }
}
