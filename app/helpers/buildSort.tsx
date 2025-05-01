import { SortOrder } from "mongoose"

import { FilterParams } from "@/types/searchParams"

const buildSort = (searchParams: FilterParams): Record<string, SortOrder> => {
  const rawSortParam = searchParams?.sort

  // Приводимо до рядка, або повертаємо порожній об'єкт
  const sortParam = typeof rawSortParam === "string" ? rawSortParam : ""

  if (!sortParam) return {}

  const isDescending = sortParam.startsWith("-")
  const field = isDescending ? sortParam.slice(1) : sortParam

  return { [field]: isDescending ? -1 : 1 }
}

export default buildSort
