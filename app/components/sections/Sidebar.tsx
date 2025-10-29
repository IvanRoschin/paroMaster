'use client';

import { IBrand, ICategory, IMinMaxPriceResponse } from '@/types/index';

import BrandFilter from './BrandFilter';
import Category from './Category';
import { PriceFilter } from './PriceFilter';
import Sort from './Sort';

interface SidebarProps {
  pricesData: IMinMaxPriceResponse;
  categories: ICategory[];
  brands: IBrand[];
}

export default function Sidebar({
  pricesData,
  categories,
  brands,
}: SidebarProps) {
  const mappedCategories = categories.map(c => ({
    value: String(c._id),
    label: c.name ?? 'Без назви',
    src: c.src ?? '',
    slug: c.slug ?? '',
  }));

  const mappedBrands = brands.map(b => ({
    value: String(b._id),
    label: b.name ?? 'Без назви',
  }));

  return (
    <div>
      <Category categories={mappedCategories} />
      <div className="hidden md:block">
        <PriceFilter
          minPrice={pricesData.minPrice ?? 0}
          maxPrice={pricesData.maxPrice ?? 100}
        />
        <Sort />
      </div>
      <BrandFilter brands={mappedBrands} />
    </div>
  );
}
