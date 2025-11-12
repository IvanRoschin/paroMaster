'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useMediaQuery } from '@/app/hooks';

import { NextImage } from '../common';

interface CategoryProps {
  categories: {
    value: string;
    slug: string;
    label: string;
    src?: string;
  }[];
}

const Category: React.FC<CategoryProps> = ({ categories }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const pathname = usePathname();

  // Определяем активную категорию по URL
  const activeCategorySlug = pathname.startsWith('/catalog/')
    ? pathname.split('/catalog/')[1]
    : '';

  return (
    <aside className="max-w-6xl mx-auto px-4 py-3 container md:w-[250px]">
      <h2 className="subtitle mb-4">Категорії товарів</h2>
      <ul
        className={`bg-secondaryBackground p-4 rounded-lg text-sm ${
          isMobile ? 'grid grid-cols-2 gap-3' : ''
        }`}
      >
        <li className="mb-3 nav">
          <Link
            href="/catalog"
            className={`flex items-center w-full text-left ${
              !activeCategorySlug ? 'font-bold text-primary' : ''
            }`}
          >
            <NextImage
              useSkeleton
              src="/goods.svg"
              width={20}
              height={20}
              className="w-5 h-5 mr-3"
              alt="Всі товари"
              priority
            />
            Всі товари
          </Link>
        </li>

        {categories.map(({ label, src, slug }) => {
          const isActive = activeCategorySlug === slug;
          return (
            <li key={slug} className="mb-3 nav">
              <Link
                href={`/category/${slug}`}
                className={`flex items-center w-full text-left ${
                  isActive ? 'font-bold text-primary' : ''
                }`}
              >
                <NextImage
                  useSkeleton
                  src={src || '/placeholder.svg'}
                  width={20}
                  height={20}
                  className="w-5 h-5 mr-3"
                  alt={label}
                  priority
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Category;
