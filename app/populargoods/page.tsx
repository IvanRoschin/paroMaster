import { getMostPopularGoods } from "@/actions/goods"
import { Breadcrumbs, ErrorMessage, InfiniteScroll, Loader } from "@/components/index"
import { IGood, ISearchParams } from "@/types/index"

interface GoodsData {
  goods: IGood[]
}

export const dynamic = "force-dynamic"

export default async function MostPopularGoodsPage({
  searchParams
}: {
  searchParams: Promise<ISearchParams>
}) {
  const params = await searchParams
  let data: GoodsData | null = null
  try {
    data = await getMostPopularGoods()
  } catch (err) {
    return <ErrorMessage error={(err as Error).message} />
  }

  if (!data) return <Loader />

  return (
    <div className="max-w-6xl mx-auto py-3 container">
      <Breadcrumbs />
      <h2 className="subtitle text-center">Популярні товари</h2>
      <div key={Math.random()}>
        <InfiniteScroll initialGoods={data.goods} searchParams={params} />
      </div>
    </div>
  )
}
