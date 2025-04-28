import { getAllCustomers } from "@/actions/customers"
import Customers from "@/components/admin/Customers"
import { usePrefetchData } from "@/hooks/usePrefetchData"
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
