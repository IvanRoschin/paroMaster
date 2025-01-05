import { getAllCustomers } from "@/actions/customers"
import Customers from "@/components/admin/Customers"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

const limit = 4

export default async function CustomersPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClinet = new QueryClient()
  await queryClinet.prefetchQuery({
    queryKey: ["customers"],
    queryFn: () => getAllCustomers(searchParams, limit)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Customers searchParams={searchParams} limit={limit} />
    </HydrationBoundary>
  )
}
