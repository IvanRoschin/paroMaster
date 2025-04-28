import { getAllSlides } from "@/actions/slider"
import Slides from "@/components/admin/Slides"
import { usePrefetchData } from "@/hooks/usePrefetchData"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function SlidesPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClinet = new QueryClient()

  await usePrefetchData(getAllSlides, ["slides"], searchParams)

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Slides searchParams={searchParams} />
    </HydrationBoundary>
  )
}
