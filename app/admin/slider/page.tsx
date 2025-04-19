import { getAllSlides } from "@/actions/slider"
import Slides from "@/components/admin/Slides"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

const limit = 10

export default async function SlidesPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClinet = new QueryClient()
  await queryClinet.prefetchQuery({
    queryKey: ["slides"],
    queryFn: () => getAllSlides(searchParams)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Slides searchParams={searchParams} />
    </HydrationBoundary>
  )
}
