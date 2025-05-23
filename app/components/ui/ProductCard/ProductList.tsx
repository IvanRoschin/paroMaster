"use client"

import { ProductCard } from "@/components/index"
import { IGood } from "@/types/index"

const ProductList = ({ goods, title }: { goods: IGood[]; title?: string }) => {
  return (
    <>
      <h2 className="subtitle-main">{title}</h2>
      <ul
        key={Math.random()}
        className="grid xl:grid-cols-4 gap-4 mb-20 md:grid-cols-2 grid-cols-1"
      >
        {goods?.map((good: IGood, i) => <ProductCard key={i} good={good} />)}
      </ul>
    </>
  )
}

export default ProductList
