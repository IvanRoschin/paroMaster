import { getAllCustomers } from "@/actions/customers"
import { Customers } from "@/admin/components"
import { usePrefetchData } from "@/hooks/index"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function CustomersPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClinet = new QueryClient()

  await usePrefetchData(getAllCustomers, ["customers"], searchParams)

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Customers params={searchParams} />
    </HydrationBoundary>
  )
}
