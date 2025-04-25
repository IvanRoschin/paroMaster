import { ISearchParams } from "@/types/searchParams"

export const buildPagination = (searchParams: ISearchParams, currentPage = 1) => {
  const limit = Number(searchParams.limit || 10)
  const skip = (currentPage - 1) * limit
  return { skip, limit }
}
