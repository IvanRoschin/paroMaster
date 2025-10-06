'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

import { getGoodById } from '@/actions/goods';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const customNames: Record<string, string> = {
  catalog: 'Каталог',
  category: 'Категорії',
  services: 'Послуги',
  works: 'Наші роботи',
  delivery: 'Доставка',
  guarantee: 'Гарантія',
  contact: 'Контакти',
  good: 'Товар',
  admin: 'Cторінка адміна',
  orders: 'Замовлення',
  goods: 'Товари',
  users: 'Адміни',
  сategories: 'Категорії',
  Categories: 'Категорії',
  testimonials: 'Відгуки',
  slider: 'Слайди',
  checkout: 'Оформлення Замовлення',
  privacypolicy: 'Політика Конфіденційності',
  publicoffer: 'Публічна Оферта',
  customers: 'Замовник',
  search: 'Пошук',
  Brands: 'Бренди',
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  const [dynamicTitle, setDynamicTitle] = useState<string | null>(null);
  const [dynamicCategory, setDynamicCategory] = useState<{
    title: string;
    slug: string;
  } | null>(null);

  const pathSegments = pathname
    .split('/')
    .filter(Boolean)
    .map(seg => decodeURIComponent(seg));

  useEffect(() => {
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Проверяем, что это ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(lastSegment)) {
      const fetchGood = async () => {
        try {
          const good = await getGoodById(lastSegment);

          const brandName = good?.brand?.name || '';
          const modelName = good?.model || '';
          const categoryTitle = good?.category?.title || '';
          const categorySlug = good?.category?.slug || '';

          setDynamicTitle(
            [brandName, modelName].filter(Boolean).join(' ') || 'Товар'
          );

          if (categoryTitle && categorySlug) {
            setDynamicCategory({ title: categoryTitle, slug: categorySlug });
          } else {
            setDynamicCategory(null);
          }
        } catch (error) {
          console.error('Error fetching good data:', error);
          setDynamicTitle('Товар');
          setDynamicCategory(null);
        }
      };

      fetchGood();
    }
  }, [pathname, pathSegments]);

  let segmentCrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    let name;

    if (index === pathSegments.length - 1 && dynamicTitle) {
      name = dynamicTitle;
    } else {
      name = customNames[segment] || capitalize(segment.replace(/-/g, ' '));
    }

    return { name, href };
  });

  // Добавляем категорию товара (между "Каталог" и товаром)
  if (dynamicCategory && segmentCrumbs.length > 1) {
    segmentCrumbs.splice(segmentCrumbs.length - 1, 0, {
      name: dynamicCategory.title,
      href: `/catalog?category=${dynamicCategory.slug}`,
    });
  }

  return (
    <nav aria-label="breadcrumbs" className="text-sm text-gray-600 mb-4">
      <ol className="flex items-center flex-wrap space-x-2">
        <li>
          <Link href="/" className="nav text-gray-600 hover:text-gray-600">
            Головна
          </Link>
        </li>
        {segmentCrumbs.map((crumb, idx) => (
          <li key={crumb.href} className="flex items-center space-x-2">
            <FaChevronRight className="mx-1 text-gray-400 text-xs" />
            <Link
              href={crumb.href}
              className={`nav text-gray-800 font-medium hover:text-gray-800 ${
                idx === segmentCrumbs.length - 1
                  ? 'text-gray-800 font-medium'
                  : 'text-blue-600'
              }`}
            >
              {crumb.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
