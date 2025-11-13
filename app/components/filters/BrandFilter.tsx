'use client';

import { useContextSelector } from 'use-context-selector';

import { FiltersContext, Option } from '@/context/FiltersContext';
import { useMediaQuery } from '@/hooks/index';

const BrandFilter = ({ brands }: { brands: Option[] }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');

  // ✅ подписываемся только на нужные части контекста
  const selectedBrands = useContextSelector(
    FiltersContext,
    ctx => ctx?.selectedBrands
  );
  const setSelectedBrands = useContextSelector(
    FiltersContext,
    ctx => ctx?.setSelectedBrands
  );

  const handleBrandClick = (brand: Option) => {
    if (!selectedBrands || !setSelectedBrands) return;

    const exists = selectedBrands.some(b => b.slug === brand.slug);
    if (exists) {
      setSelectedBrands(selectedBrands.filter(b => b.slug !== brand.slug));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-3 container md:w-[250px]">
      <h2 className="subtitle-main">Бренди</h2>

      <ul
        className={`p-4 ${
          isMobile
            ? 'grid grid-cols-3 sm:grid-cols-4 gap-3 justify-items-center'
            : 'space-y-2'
        }`}
      >
        {brands.map((brand, i) => {
          const isChecked = selectedBrands?.some(b => b.slug === brand.slug);

          return (
            <li
              key={i}
              className={`flex items-center justify-center ${
                isMobile
                  ? 'flex-col w-full aspect-square bg-secondaryBackground rounded-lg text-center text-xs sm:text-sm p-2 select-none transition-all duration-200 cursor-pointer hover:shadow-md active:scale-95 ' +
                    (isChecked ? 'ring-2 ring-primary font-semibold' : '')
                  : 'space-x-2'
              }`}
              onClick={() => handleBrandClick(brand)}
            >
              {!isMobile && (
                <input
                  type="checkbox"
                  checked={!!isChecked}
                  onChange={() => handleBrandClick(brand)}
                  className="custom-checkbox"
                  id={`checkbox-${i}`}
                />
              )}
              <label
                htmlFor={`checkbox-${i}`}
                className={`cursor-pointer ${
                  isMobile ? 'block w-full text-center' : ''
                }`}
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
