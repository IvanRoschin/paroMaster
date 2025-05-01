import { IGetAllCategories } from "@/actions/categories"
import { IGetAllBrands } from "@/actions/goods"
import { BrandFilter, Category, PriceFilter, Sort } from "@/components/index"

interface SidebarProps {
  categoriesData: IGetAllCategories
  brandsData: IGetAllBrands
  pricesData: { minPrice: number; maxPrice: number }
}

const Sidebar = ({ pricesData, categoriesData, brandsData }: SidebarProps) => {
  return (
    <div>
      <Category categories={categoriesData?.categories} />
      <div className="hidden md:block">
        <PriceFilter minPrice={pricesData.minPrice} maxPrice={pricesData.maxPrice} />
        <Sort />
      </div>
      <BrandFilter brands={brandsData?.brands} />
    </div>
  )
}

export default Sidebar
