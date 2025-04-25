"use client"

import { getMostPopularGoods } from "@/actions/goods"
import InfiniteScrollGoods from "@/components/InfiniteScrollGoods"
import ErrorMessage from "@/components/ui/Error"
import { IGood, ISearchParams } from "@/types/index"
import { Loader } from "../components"
import { useFetchData } from "../hooks"

interface GoodsData {
  goods: IGood[]
}
export default async function MostPopularGoodsPage({
  searchParams
}: {
  searchParams: ISearchParams
}) {
  const { data, error, isError, isLoading, refetch } = useFetchData(
    getMostPopularGoods,
    ["populargoods"],
    searchParams
  )

  if (!data || isLoading) {
    return <Loader />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className="max-w-6xl mx-auto py-3 container">
      <h2 className="subtitle text-center">Популярні товари</h2>
      <div key={Math.random()}>
        <InfiniteScrollGoods initialGoods={data.goods} searchParams={searchParams} />
      </div>
    </div>
  )
}
