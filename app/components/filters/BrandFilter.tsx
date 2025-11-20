'use client';

import { useContextSelector } from 'use-context-selector';

import { FiltersContext, Option } from '@/context/FiltersContext';
import { useMediaQuery } from '@/hooks/index';

const BrandFilter = ({ brands }: { brands: Option[] }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const selectedBrands = useContextSelector(
    FiltersContext,
    ctx => ctx?.selectedBrands ?? []
  );

  const setSelectedBrands = useContextSelector(
    FiltersContext,
    ctx => ctx?.setSelectedBrands
  );

  const handleBrandClick = (brand: Option) => {
    if (!setSelectedBrands) return;

    setSelectedBrands(prev =>
      prev.some(b => b.slug === brand.slug)
        ? prev.filter(b => b.slug !== brand.slug)
        : [...prev, brand]
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-3 container md:w-[250px]">
      <h2 className="subtitle-main">Бренди</h2>

      <ul
        className={`p-4 ${
          isMobile ? 'grid grid-cols-3 sm:grid-cols-4 gap-3' : 'space-y-2'
        }`}
      >
        {brands.map((brand, i) => {
          const isChecked = selectedBrands.some(b => b.slug === brand.slug);

          return (
            <li
              key={brand.slug ?? i}
              className={`flex items-center cursor-pointer transition-all ${
                isMobile
                  ? `flex-col w-full aspect-square bg-secondaryBackground rounded-lg 
                     text-center text-xs sm:text-sm p-2 select-none hover:shadow-md active:scale-95
                     ${isChecked ? 'ring-2 ring-primary font-semibold' : ''}`
                  : 'space-x-2'
              }`}
              onClick={() => handleBrandClick(brand)} // теперь одинаково для мобилки и десктопа
            >
              {!isMobile && (
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly // важный момент, чтобы React не ругался
                  className="custom-checkbox"
                  id={`brand-${i}`}
                />
              )}

              <label
                htmlFor={`brand-${i}`}
                className={
                  isMobile ? 'block w-full text-center' : 'cursor-pointer'
                }
              >
                {brand.label}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BrandFilter;
