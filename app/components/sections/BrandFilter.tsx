'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useMediaQuery } from '@/hooks/index';

const BrandFilter = ({ brands }: { brands: string[] }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const selectedBrands = searchParams.getAll('brand');

  const handleBrandCheckboxClick = (brand: string) => {
    let updatedBrands: string[];
    if (selectedBrands.includes(brand)) {
      updatedBrands = selectedBrands.filter(b => b !== brand);
    } else {
      updatedBrands = [...selectedBrands, brand];
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete('brand');
    updatedBrands.forEach(b => params.append('brand', b));

    push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      <h2 className="subtitle-main">Бренди</h2>
      <ul className={`p-4 ${isMobile ? 'grid grid-cols-3 gap-3' : ''}`}>
        {brands.map((brand, index) => {
          const isChecked = selectedBrands.includes(brand);
          return (
            <li key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleBrandCheckboxClick(brand)}
                className="custom-checkbox"
                id={`checkbox-${index}`}
              />
              <label
                htmlFor={`checkbox-${index}`}
                className="text-primaryTextColor cursor-pointer"
              >
                {brand}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BrandFilter;
