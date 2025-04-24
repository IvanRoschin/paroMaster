import { FilterParams } from "@/types/searchParams"

export const buildFilter = (params: FilterParams): any => {
  const filter: any = {}
  const andConditions = []

  // Цена
  const low = Number(params.low)
  const high = Number(params.high)
  if (!isNaN(low) && !isNaN(high)) {
    andConditions.push({
      $expr: {
        $and: [{ $gte: [{ $toDouble: "$price" }, low] }, { $lte: [{ $toDouble: "$price" }, high] }]
      }
    })
  }

  // Поиск
  if (params.q) {
    andConditions.push({
      $or: [
        { title: { $regex: params.q, $options: "i" } },
        { vendor: params.q },
        { brand: { $regex: params.q, $options: "i" } },
        { model: { $regex: params.q, $options: "i" } },
        { compatibility: { $regex: params.q, $options: "i" } }
      ]
    })
  }

  if (andConditions.length) {
    filter.$and = andConditions
  }

  // Прямые фильтры
  if (params.brand) filter.brand = params.brand
  if (params.category) filter.category = params.category

  return filter
}
