"use client"

import { getMostPopularGoods } from "@/actions/goods"
import { Breadcrumbs, ErrorMessage, InfiniteScroll, Loader } from "@/components/index"
import { useFetchData } from "@/hooks/index"
import { IGood, ISearchParams } from "@/types/index"

interface GoodsData {
  goods: IGood[]
}
export default function MostPopularGoodsPage({ searchParams }: { searchParams: ISearchParams }) {
  const { data, error, isError, isLoading, refetch } = useFetchData(
    getMostPopularGoods,
    ["populargoods"],
    searchParams
  )

  if (!data || isLoading) {
    return <Loader />
  }

  if (isError) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className="max-w-6xl mx-auto py-3 container">
      <Breadcrumbs />
      <h2 className="subtitle text-center">Популярні товари</h2>
      <div key={Math.random()}>
        <InfiniteScroll initialGoods={data.goods} searchParams={searchParams} />
      </div>
    </div>
  )
}
