'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

import { getGoodByIdAction } from '@/actions/goods';

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
  categories: 'Категорії',
  testimonials: 'Відгуки',
  slider: 'Слайди',
  checkout: 'Оформлення Замовлення',
  privacypolicy: 'Політика Конфіденційності',
  publicoffer: 'Публічна Оферта',
  customers: 'Замовник',
  search: 'Пошук',
  brands: 'Бренди',
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  const [dynamicTitle, setDynamicTitle] = useState<string | null>(null);
  const [category, setCategory] = useState<{
    name: string;
    slug: string;
  } | null>(null);

  // 1️⃣ Мемоизация сегментов пути
  const pathSegments = useMemo(
    () =>
      pathname
        .split('/')
        .filter(Boolean)
        .map(seg => decodeURIComponent(seg)),
    [pathname]
  );

  // 2️⃣ Если последний сегмент — ObjectId, подтягиваем товар
  useEffect(() => {
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (!/^[0-9a-fA-F]{24}$/.test(lastSegment)) {
      setDynamicTitle(null);
      setCategory(null);
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const good = await getGoodByIdAction(lastSegment);
        if (!isMounted || !good) return;

        const brand = typeof good.brand === 'object' ? good.brand?.name : '';
        const model = good.model || '';
        const productTitle =
          [brand, model].filter(Boolean).join(' ') || good.title;

        setDynamicTitle(productTitle);

        if (good.category && typeof good.category === 'object') {
          setCategory({
            name: good.category.name,
            slug: good.category.slug,
          });
        } else {
          setCategory(null);
        }
      } catch (error) {
        console.error('❌ Breadcrumbs fetch error:', error);
        if (isMounted) {
          setDynamicTitle(null);
          setCategory(null);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [pathSegments]);

  // 3️⃣ Формирование крошек
  const crumbs = useMemo(() => {
    let base = pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const isLast = index === pathSegments.length - 1;

      let name = customNames[segment] || capitalize(segment.replace(/-/g, ' '));
      if (isLast && dynamicTitle) name = dynamicTitle;

      return { name, href };
    });

    // Добавляем категорию между "Каталог" и товаром
    if (category && base.length > 1) {
      base.splice(base.length - 1, 0, {
        name: category.name,
        href: `/catalog?category=${category.slug}`,
      });
    }

    return base;
  }, [pathSegments, dynamicTitle, category]);

  // 4️⃣ JSX
  return (
    <nav aria-label="breadcrumbs" className="text-sm text-gray-600 mb-4">
      <ol className="flex items-center flex-wrap space-x-2">
        <li>
          <Link href="/" className="nav text-gray-600 hover:text-gray-600">
            Головна
          </Link>
        </li>

        {crumbs.map((crumb, idx) => (
          <li key={crumb.href} className="flex items-center space-x-2">
            <FaChevronRight className="mx-1 text-gray-400 text-xs" />
            <Link
              href={crumb.href}
              className="nav text-gray-600 hover:text-gray-600"
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
