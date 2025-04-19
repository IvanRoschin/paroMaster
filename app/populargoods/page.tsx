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
    <div className="container">
      <h2 className="title mb-1">Популярні товари</h2>
      <div key={Math.random()}>
        <InfiniteScrollGoods initialGoods={data.goods} searchParams={searchParams} />
      </div>
    </div>
  )
}
