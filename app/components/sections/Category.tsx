import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { useMediaQuery } from '@/hooks/index';

interface CategoryPage {
  categories: { value: string; label: string; src: string; slug: string }[];
}

const Category: React.FC<CategoryPage> = ({ categories }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');

  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(name, value);
      else params.delete(name);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-3 container md:w-[250px]">
      <h2 className="subtitle mb-4">Категорії товарів</h2>

      {/* Conditional rendering based on isMobile */}
      <ul
        className={`bg-secondaryBackground p-4 rounded-lg text-sm ${
          isMobile ? 'grid grid-cols-2 gap-3' : ''
        }`}
      >
        {categories.map(({ value, label, src, slug }, i) => (
          <li key={i} className="mb-3 nav">
            <Link
              href={`/category/?${createQueryString('category', value)}`}
              className="flex justify-start items-start group"
            >
              <Image
                alt={label}
                src={src || '/placeholder.svg'}
                width={20}
                height={20}
                className="w-5 h-5 mr-3 transition-filter duration-300 ease-in-out group-hover:filter-primary"
                priority={true}
              />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
