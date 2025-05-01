import { getAllSlides } from "@/actions/slider"
import { Slides } from "@/admin/components"
import { usePrefetchData } from "@/hooks/index"
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
