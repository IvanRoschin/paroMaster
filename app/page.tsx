import { getAllGoods } from "@/actions/goods"
import { getAllTestimonials, IGetAllTestimonials } from "@/actions/testimonials"
import { Advantages, Description, ItemsList, Slider, TestimonialsList } from "@/components/index"
import { IGood, ISearchParams, ITestimonial } from "@/types/index"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { getAllSlides, IGetAllSlides } from "./actions/slider"

interface GoodsData {
  goods: IGood[]
}

export default async function Home({ searchParams }: { searchParams: ISearchParams }) {
  const queryClient = new QueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: ["slides"],
      queryFn: () => getAllSlides(searchParams)
    })
    await queryClient.prefetchQuery({
      queryKey: ["testimonials"],
      queryFn: () => getAllTestimonials(searchParams)
    })
    await queryClient.prefetchQuery({
      queryKey: ["goods"],
      queryFn: () => getAllGoods({ limit: String(4) })
    })
  } catch (error) {
    console.error("Error prefetching data:", error)
  }

  const queryState = queryClient.getQueryState(["goods"])

  const goods = (queryState?.data as GoodsData)?.goods || []

  const slidesData = queryClient.getQueryData<IGetAllSlides>(["slides"])
  const testimonialsData = queryClient.getQueryData<IGetAllTestimonials>(["allTestimonials"])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container">
        <section className="hidden lg:block">
          <Slider
            slidesData={slidesData}
            testimonialsData={testimonialsData}
            DescriptionComponent={Description}
          />
        </section>
        <section>
          <ItemsList goods={goods} title="Пропозиції дня" />
        </section>
        <section>
          <div className="flex flex-col">
            {testimonialsData && (
              <TestimonialsList
                testimonialsData={{
                  ...testimonialsData,
                  testimonials: testimonialsData.testimonials.filter(
                    (testimonial: ITestimonial) => testimonial.isActive
                  )
                }}
                title="Відгуки клієнтів"
              />
            )}
          </div>
        </section>
        <section>
          <Advantages title="Переваги" />
        </section>
      </div>
    </HydrationBoundary>
  )
}
