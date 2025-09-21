import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { IGood, ISearchParams, ITestimonial } from "@/types/index"
import { getAllGoods } from "./actions/goods"
import { getAllSlides, IGetAllSlides } from "./actions/slider"
import { getAllTestimonials, IGetAllTestimonials } from "./actions/testimonials"
import { Advantages, Description, ProductList, Slider, TestimonialsList } from "./components"

interface GoodsData {
  goods: IGood[]
}

export default async function Home({ searchParams }: { searchParams: Promise<ISearchParams> }) {
  const params = await searchParams

  const queryClient = new QueryClient()

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["slides", params],
        queryFn: () => getAllSlides(params)
      }),
      queryClient.prefetchQuery({
        queryKey: ["testimonials", params],
        queryFn: () => getAllTestimonials(params)
      }),
      queryClient.prefetchQuery({
        queryKey: ["goods", { limit: 4 }],
        queryFn: () => getAllGoods({ limit: "4" })
      })
    ])
  } catch (error) {
    console.error("Error prefetching data:", error)
  }

  // Достаём данные из кеша
  const goodsData = queryClient.getQueryData<GoodsData>(["goods", { limit: 4 }])
  const goods = goodsData?.goods ?? []

  const slidesData = queryClient.getQueryData<IGetAllSlides>(["slides", params])
  const testimonialsData = queryClient.getQueryData<IGetAllTestimonials>(["testimonials", params])

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
          <ProductList goods={goods} title="Пропозиції дня" />
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
