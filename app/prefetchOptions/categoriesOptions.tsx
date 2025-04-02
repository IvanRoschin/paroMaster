import { getAllCategories } from "@/actions/categories"
import { queryOptions } from "@tanstack/react-query"

export const categoriesOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const response = await getAllCategories()

    return response
  }
})
