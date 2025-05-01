import { uniqueBrands } from "@/actions/goods"
import { queryOptions } from "@tanstack/react-query"

const brandsOptions = queryOptions({
  queryKey: ["brands"],
  queryFn: async () => {
    const response = await uniqueBrands()

    return response
  }
})

export default brandsOptions
