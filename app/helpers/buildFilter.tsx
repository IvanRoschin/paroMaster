import { ISearchParams } from "@/types/searchParams"

export const buildFilter = (searchParams: ISearchParams): any => {
  const filter: any = {}
  const andConditions = []

  // Цена
  const low = Number(searchParams.low)
  const high = Number(searchParams.high)
  if (!isNaN(low) && !isNaN(high)) {
    andConditions.push({
      $expr: {
        $and: [{ $gte: [{ $toDouble: "$price" }, low] }, { $lte: [{ $toDouble: "$price" }, high] }]
      }
    })
  }

  // Поиск
  if (searchParams.q) {
    andConditions.push({
      $or: [
        { title: { $regex: searchParams.q, $options: "i" } },
        { vendor: searchParams.q },
        { brand: { $regex: searchParams.q, $options: "i" } },
        { model: { $regex: searchParams.q, $options: "i" } },
        { compatibility: { $regex: searchParams.q, $options: "i" } }
      ]
    })
  }

  if (andConditions.length) {
    filter.$and = andConditions
  }

  // Прямые фильтры
  if (searchParams.isActive) filter.isActive = searchParams.isActive
  if (searchParams.brand) filter.brand = searchParams.brand
  if (searchParams.category) filter.category = searchParams.category

  return filter
}
