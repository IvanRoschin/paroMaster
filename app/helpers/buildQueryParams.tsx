import { ISearchParams } from "@/types/searchParams"

const buildQueryParams = (searchParams: ISearchParams): string => {
  const params = new URLSearchParams()

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => {
        if (v) params.append(key, String(v))
      })
    } else if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value))
    }
  })

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ""
}

export default buildQueryParams
