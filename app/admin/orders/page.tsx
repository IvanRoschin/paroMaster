import { getAllOrders } from "@/actions/orders"
import { Orders } from "@/admin/components/index"
import { usePrefetchData } from "@/hooks/index"
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
