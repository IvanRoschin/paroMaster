import { getAllOrders } from "@/actions/orders"
import Orders from "@/components/admin/Orders"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function OrdersPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClinet = new QueryClient()
  await queryClinet.prefetchQuery({
    queryKey: ["orders"],
    queryFn: () => getAllOrders(searchParams)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Orders />
    </HydrationBoundary>
  )
}
