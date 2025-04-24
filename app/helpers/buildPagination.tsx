import { FilterParams } from "@/types/searchParams"

export const buildPagination = (params: FilterParams, currentPage = 1) => {
  const limit = Number(params.limit || 10)
  const skip = (currentPage - 1) * limit
  return { skip, limit }
}
