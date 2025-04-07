import { getAllCategories } from "@/actions/categories"
import { ICategory } from "@/types/index"
import { useFetchData } from "../hooks"

export const useCategoriesEnum = () => {
  const {
    data: categories,
    isLoading,
    isError
  } = useFetchData(null, params => getAllCategories({ limit: 10000, page: 1 }), "categories")

  const allowedCategories = categories?.categories.map((cat: ICategory) => cat.title) ?? []

  return {
    categories,
    allowedCategories,
    isLoading,
    isError
  }
}
