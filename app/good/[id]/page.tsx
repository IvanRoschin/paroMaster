import { notFound } from "next/navigation"

import { getGoodById } from "@/actions/goods"

import GoodPageClient from "./GoodPageClient"

interface GoodPageProps {
  params: { id: string } | Promise<{ id: string }>
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

  return <GoodPageClient initialGood={good} />
}
