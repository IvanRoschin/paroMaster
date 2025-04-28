import { getAllUsers } from "@/actions/users"
import Users from "@/components/admin/Users"
import { usePrefetchData } from "@/hooks/usePrefetchData"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

const limit = 4

export default async function UsersPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClinet = new QueryClient()

  await usePrefetchData(getAllUsers, ["users"], searchParams)

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Users searchParams={searchParams} />
    </HydrationBoundary>
  )
}
