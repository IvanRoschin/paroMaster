import { getAllUsers } from "@/actions/users"
import Users from "@/components/admin/Users"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

const limit = 4

export default async function UsersPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClinet = new QueryClient()
  await queryClinet.prefetchQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(searchParams, limit)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Users searchParams={searchParams} limit={limit} />
    </HydrationBoundary>
  )
}
