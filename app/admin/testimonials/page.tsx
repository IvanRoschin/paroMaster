import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { getAllTestimonials } from "@/actions/testimonials"
import Testimonials from "@/admin/components/sections/Testimonials"
import prefetchData from "@/hooks/usePrefetchData"
import { ISearchParams } from "@/types/searchParams"

export default async function TestimonialsPage({
  searchParams
}: {
  searchParams: Promise<ISearchParams>
}) {
  const params = await searchParams

  const queryClient = new QueryClient()
  await prefetchData(queryClient, getAllTestimonials, ["testimonials"], params)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Testimonials />
    </HydrationBoundary>
  )
}
