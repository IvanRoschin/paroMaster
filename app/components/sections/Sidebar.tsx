import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getMinMaxPrice } from '@/actions/goods';
import { BrandFilter, Category, PriceFilter, Sort } from '@/components/index';
import { IBrand, ICategory, ISearchParams } from '@/types/index';

interface Categories {
  value: string;
  label: string;
  src: string;
  slug: string;
}

interface Brands {
  value: string;
  label: string;
}

interface SidebarProps {
  searchParams?: ISearchParams;
}

const Sidebar = async ({ searchParams }: SidebarProps) => {
  const [pricesData, categoriesResponse, brandsResponse] = await Promise.all([
    getMinMaxPrice(),
    getAllCategories(searchParams ?? {}),
    getAllBrands(searchParams ?? {}),
  ]);

  const categories: Categories[] =
    (categoriesResponse.categories ?? [])
      .filter((c: ICategory) => c._id)
      .map((c: ICategory) => ({
        value: String(c._id),
        label: c.name ?? 'Без назви',
        src: c.src ?? '',
        slug: c.slug ?? '',
      })) ?? [];

  const brands: Brands[] =
    (brandsResponse.brands ?? [])
      .filter((b: IBrand) => b._id)
      .map((b: IBrand) => ({
        value: String(b._id),
        label: b.name ?? 'Без назви',
      })) ?? [];

  return (
    <div>
      <Category categories={categories} />

      <div className="hidden md:block">
        <PriceFilter
          minPrice={pricesData.minPrice ?? 0}
          maxPrice={pricesData.maxPrice ?? 100}
        />
        <Sort />
      </div>

      <BrandFilter brands={brands} />
    </div>
  );
};

export default Sidebar;
