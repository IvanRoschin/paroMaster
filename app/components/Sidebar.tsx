import { IGetAllCategories } from "@/actions/categories"
import { IGetAllBrands } from "@/actions/goods"
import BrandFilter from "./BrandFilter"
import Category from "./Category"
import PriceFilter from "./PriceFilter/PriceFilter"
import Sort from "./Sort"

interface SidebarProps {
  categoriesData: IGetAllCategories
  brandsData: IGetAllBrands
}

export default function Sidebar({ categoriesData, brandsData }: SidebarProps) {
  return (
    <div>
      <Category categories={categoriesData?.categories} />
      <div className="hidden md:block">
        <PriceFilter />
        <Sort />
      </div>
      <BrandFilter brands={brandsData?.brands} />
    </div>
  )
}
