import { FilterParams } from "@/types/searchParams"
import { SortOrder } from "mongoose"

export const buildSort = (searchParams: FilterParams): Record<string, SortOrder> => {
  const sortValue: SortOrder = searchParams?.sort === "desc" ? -1 : 1
  return { price: sortValue }
}
