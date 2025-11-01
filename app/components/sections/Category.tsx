'use client';

import Image from 'next/image';

import { Option, useFilter } from '@/context/FiltersContext';
import { useMediaQuery } from '@/hooks/index';

interface CategoryPage {
  categories: Option[];
}

const Category: React.FC<CategoryPage> = ({ categories }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { selectedCategory, setCategory } = useFilter();

  return (
    <div className="max-w-6xl mx-auto px-4 py-3 container md:w-[250px]">
      <h2 className="subtitle mb-4">Категорії товарів</h2>
      <ul
        className={`bg-secondaryBackground p-4 rounded-lg text-sm ${isMobile ? 'grid grid-cols-2 gap-3' : ''}`}
      >
        {categories.map(({ label, src, slug }, i) => {
          const isActive = selectedCategory === slug;
          return (
            <li key={i} className="mb-3 nav">
              <button
                onClick={() => setCategory(isActive ? '' : slug || '')}
                className={`flex items-center w-full text-left ${isActive ? 'font-bold text-primary' : ''}`}
              >
                <Image
                  src={src || '/placeholder.svg'}
                  width={20}
                  height={20}
                  className="w-5 h-5 mr-3"
                  alt={label}
                  priority
                />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Category;
