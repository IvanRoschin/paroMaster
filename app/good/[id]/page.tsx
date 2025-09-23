import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { notFound } from "next/navigation"

import { getGoodById } from "@/actions/goods"
import { getGoodTestimonials } from "@/actions/testimonials"
import prefetchData from "@/hooks/usePrefetchData"
import GoodPageClient from "./GoodPageClient"

interface GoodPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: GoodPageProps) {
  const resolvedParams = await params

  const { id } = resolvedParams

  const good = await getGoodById(id)

  if (!good) {
    return {
      title: "Товар не знайдено | ParoMaster",
      description: "Цей товар більше не доступний."
    }
  }

  return {
    title: `${good.title} | ParoMaster`,
    description: good.description || "Деталі про товар.",
    openGraph: {
      title: good.title,
      description: good.description,
      images: good.images?.map((img: string) => ({ url: img })) || []
    }
  }
}

export default async function GoodPage({ params }: GoodPageProps) {
  const resolvedParams = await params

  const { id } = resolvedParams

  const good = await getGoodById(id)

  if (!good) notFound()

  const queryClient = new QueryClient()
  await prefetchData(queryClient, getGoodTestimonials, ["testimonials", good.id], good.id)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GoodPageClient initialGood={good} />
    </HydrationBoundary>
  )
}
