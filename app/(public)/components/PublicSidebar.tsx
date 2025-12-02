'use client';

import { BrandFilter, Category, PriceFilter, Sort } from '@/components/index';
import { IBrand, ICategory, IMinMaxPriceResponse } from '@/types/index';

export interface Option {
  value: string;
  label: string;
  slug?: string;
}
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
  const mappedCategories = categories.map(c => ({
    value: String(c._id),
    slug: c.slug,
    label: c.name,
    src: c.src || '/placeholder.svg', // дефолтная картинка
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
