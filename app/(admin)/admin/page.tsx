'use client';

import {
  MdAdminPanelSettings,
  MdCategory,
  MdInventory2,
  MdPayments,
  MdPeople,
  MdRateReview,
  MdShoppingCart,
  MdSlideshow,
  MdStars,
} from 'react-icons/md';

import { getEntityCounts } from '@/app/actions/admin';
import { useQuery } from '@tanstack/react-query';

import { Card } from '../Card';

const titles = {
  customers: 'Замовники',
  orders: 'Замовлення',
  categories: 'Категорії',
  goods: 'Товари',
  brands: 'Бренди',
  payments: 'Платежі',
  users: 'Користувачі',
  testimonials: 'Відгуки',
  slides: 'Слайди',
} as const;

const icons = {
  customers: MdPeople,
  orders: MdShoppingCart,
  categories: MdCategory,
  goods: MdInventory2,
  brands: MdStars,
  payments: MdPayments,
  users: MdAdminPanelSettings,
  testimonials: MdRateReview,
  slides: MdSlideshow,
} as const;

const links = {
  customers: '/admin/customers',
  orders: '/admin/orders',
  categories: '/admin/categories',
  goods: '/admin/goods',
  brands: '/admin/brands',
  payments: '/admin/payments',
  users: '/admin/users',
  testimonials: '/admin/testimonials',
  slides: '/admin/slides',
} as const;

const fetchCounts = async () => {
  const data = await getEntityCounts();
  if (!data.success) throw new Error('Не вдалося отримати дані');
  return data.counts;
};

const AdminPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-counts'],
    queryFn: fetchCounts,
  });

  if (isLoading)
    return <div className="container py-10 text-center">Завантаження...</div>;

  if (isError)
    return (
      <div className="container py-10 text-center text-red-600">
        Помилка завантаження
      </div>
    );

  const items = Object.entries(titles).map(([key, title]) => ({
    title,
    count: data?.[key as keyof typeof data] ?? 0,
    link: links[key as keyof typeof links],
    icon: icons[key as keyof typeof icons],
  }));

  return (
    <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-10">
      {items.map(item => (
        <Card key={item.title} {...item} />
      ))}
    </div>
  );
};

export default AdminPage;
