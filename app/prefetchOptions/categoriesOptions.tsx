import { getAllCategories } from "@/actions/categories"
import { queryOptions } from "@tanstack/react-query"
import { URLSearchParams } from "url"

const params = new URLSearchParams()

export const categoriesOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const response = await getAllCategories({ searchParams: params })

    return response
  }
})
