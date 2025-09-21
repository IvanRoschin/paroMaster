import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { getAllOrders } from "@/actions/orders"
import { Orders } from "@/admin/components/index"
import prefetchData from "@/hooks/usePrefetchData"
import { ISearchParams } from "@/types/searchParams"

export default async function OrdersPage({
  searchParams
}: {
  searchParams: Promise<ISearchParams>
}) {
  const queryClient = new QueryClient()
  const params = await searchParams

  await prefetchData(queryClient, getAllOrders, ["orders"], params)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Orders />
    </HydrationBoundary>
  )
}
