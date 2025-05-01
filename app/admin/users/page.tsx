import { getAllUsers } from "@/actions/users"
import { Users } from "@/admin/components"
import { usePrefetchData } from "@/hooks/index"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function UsersPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClinet = new QueryClient()

  await usePrefetchData(getAllUsers, ["users"], searchParams)

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Users searchParams={searchParams} />
    </HydrationBoundary>
  )
}
