import { getAllOrders } from "@/actions/orders"
import Orders from "@/components/admin/Orders"
import { usePrefetchData } from "@/hooks/usePrefetchData"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function OrdersPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClinet = new QueryClient()

  await usePrefetchData(getAllOrders, ["orders"], searchParams)

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Orders />
    </HydrationBoundary>
  )
}
