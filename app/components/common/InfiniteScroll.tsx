"use client"

import { useCallback, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { TailSpin } from "react-loader-spinner"

import { getAllGoods } from "@/actions/goods"
import { ProductList } from "@/components/ui"
import { IGood } from "@/types/IGood"
import { ISearchParams } from "@/types/searchParams"

const InfiniteScroll = ({
  initialGoods,
  searchParams
}: {
  initialGoods: IGood[]
  searchParams: ISearchParams
}) => {
  const [goods, setGoods] = useState<IGood[]>(initialGoods || [])
  const [pagesLoaded, setPagesLoaded] = useState(1)
  const [allGoodsLoaded, setAllGoodsLoaded] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.5 // Trigger load when the element is halfway in view
  })

  useEffect(() => {
    if (initialGoods) {
      setGoods(initialGoods)
    }
  }, [initialGoods])

  const loadMoreGoods = useCallback(async () => {
    if (isFetchingMore || allGoodsLoaded) return // Prevent multiple fetches

    setIsFetchingMore(true)

    const nextPage = pagesLoaded + 1
    const newGoods = (await getAllGoods({ ...searchParams, page: nextPage.toString() })) ?? []

    if (newGoods?.goods?.length > 0) {
      setGoods(prevGoods => [...prevGoods, ...newGoods.goods])
      setPagesLoaded(nextPage)
    } else {
      setAllGoodsLoaded(true)
    }

    setIsFetchingMore(false)
  }, [isFetchingMore, allGoodsLoaded, pagesLoaded, searchParams])

  useEffect(() => {
    if (inView && !allGoodsLoaded && !isFetchingMore) {
      loadMoreGoods()
    }
  }, [inView, allGoodsLoaded, isFetchingMore, loadMoreGoods])

  return (
    <>
      <section>
        <ProductList goods={goods} />
      </section>
      <section className="flex flex-col items-center justify-center py-10 gap-4">
        {allGoodsLoaded ? (
          <p className="subtitle mb-4 text-center">Це всі 🤷‍♂️ наявні Товари 🛒</p>
        ) : (
          <div ref={ref} className="flex items-center justify-center py-10">
            <TailSpin
              visible={true}
              height="40"
              width="40"
              color="#ea580c"
              ariaLabel="tail-spin-loading"
              radius="1"
            />
          </div>
        )}
      </section>
    </>
  )
}

export default InfiniteScroll
