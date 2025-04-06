import { getAllTestimonials } from "@/actions/testimonials"
import Testimonials from "@/components/admin/Testimonials"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

const limit = 10

export default async function TestimonialsPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClinet = new QueryClient()
  await queryClinet.prefetchQuery({
    queryKey: ["testimonials"],
    queryFn: () => getAllTestimonials(searchParams)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Testimonials searchParams={searchParams} />
    </HydrationBoundary>
  )
}
