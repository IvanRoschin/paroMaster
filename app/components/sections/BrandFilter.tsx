'use client';

import { Option, useFilter } from '@/context/FiltersContext';
import { useMediaQuery } from '@/hooks/index';

const BrandFilter = ({ brands }: { brands: Option[] }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { selectedBrands, setSelectedBrands } = useFilter();

  const handleBrandClick = (brand: Option) => {
    const exists = selectedBrands.some(b => b.slug === brand.slug);
    if (exists) {
      setSelectedBrands(selectedBrands.filter(b => b.slug !== brand.slug));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div>
      <h2 className="subtitle-main">Бренди</h2>
      <ul className={`p-4 ${isMobile ? 'grid grid-cols-3 gap-3' : ''}`}>
        {brands.map((brand, i) => {
          const isChecked = selectedBrands.some(b => b.slug === brand.slug);
          return (
            <li key={i} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleBrandClick(brand)}
                className="custom-checkbox"
                id={`checkbox-${i}`}
              />
              <label htmlFor={`checkbox-${i}`} className="cursor-pointer">
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
