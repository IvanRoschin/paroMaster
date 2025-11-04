'use client';

import { BrandFilter, Category, PriceFilter, Sort } from '@/components/index';
import { Option } from '@/context/FiltersContext';
import { IBrand, ICategory, IMinMaxPriceResponse } from '@/types/index';

interface SidebarProps {
  pricesData: IMinMaxPriceResponse;
  categories: ICategory[];
  brands: IBrand[];
}

export default function PublicSidebar({
  pricesData,
  categories,
  brands,
}: SidebarProps) {
  const mappedBrands: Option[] = brands.map(b => ({
    value: String(b._id),
    label: b.name,
    slug: b.slug,
  }));

  // Маппим категории на Option[] (если нужно для контекста)
  const mappedCategories: Option[] = categories.map(c => ({
    value: String(c._id),
    label: c.name,
    slug: c.slug,
    src: c.src,
  }));

  return (
    <div>
      <Category categories={mappedCategories} />
      <div className="hidden md:block">
        <PriceFilter
          minPriceFromDB={pricesData.minPrice ?? 0}
          maxPriceFromDB={pricesData.maxPrice ?? 100}
        />
        <Sort />
      </div>
      <BrandFilter brands={mappedBrands} />
    </div>
  );
}
