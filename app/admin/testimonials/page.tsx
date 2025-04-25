import { getAllTestimonials } from "@/actions/testimonials"
import Testimonials from "@/components/admin/Testimonials"
import { usePrefetchData } from "@/hooks/usePrefetchData"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function TestimonialsPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClient = new QueryClient()
  await usePrefetchData(getAllTestimonials, "testimonials", searchParams)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Testimonials />
    </HydrationBoundary>
  )
}
