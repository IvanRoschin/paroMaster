import { JSX } from 'react';
import { LuFolderHeart } from 'react-icons/lu';
import {
  MdBrandingWatermark,
  MdDashboard,
  MdPayment,
  MdProductionQuantityLimits,
  MdShoppingBag,
  MdSupervisedUserCircle,
  MdVerifiedUser,
} from 'react-icons/md';
import { SiTestinglibrary } from 'react-icons/si';
import { TbCategoryPlus } from 'react-icons/tb';
import { TfiLayoutSlider } from 'react-icons/tfi';

import { UserRole } from '@/types/IUser';

import { routes } from '../helpers/routes';

/**
 * 🧱 Словарь иконок по ключам маршрутов
 */
export const iconMap: Record<string, JSX.Element> = {
  dashboard: <MdDashboard />,
  customers: <MdSupervisedUserCircle />,
  orders: <MdProductionQuantityLimits />,
  categories: <TbCategoryPlus />,
  goods: <MdShoppingBag />,
  brands: <MdBrandingWatermark />,
  payments: <MdPayment />,
  users: <MdVerifiedUser />,
  testimonials: <SiTestinglibrary />,
  slides: <TfiLayoutSlider />,

  // Customer routes
  changePassword: <MdVerifiedUser />,
  changeUserData: <MdSupervisedUserCircle />,
  changeDeliveryAddress: <TbCategoryPlus />,
  favorites: <LuFolderHeart />,
  ordersHistroy: <MdShoppingBag />,
};

/**
 * 🏷️ Словарь названий пунктов (читаемые подписи)
 */
export const titleMap: Record<string, string> = {
  dashboard: 'Панель керування',
  customers: 'Замовники',
  orders: 'Замовлення',
  categories: 'Категорії',
  goods: 'Товари',
  brands: 'Бренди',
  payments: 'Платежі',
  users: 'Користувачі',
  testimonials: 'Відгуки',
  slides: 'Слайди',

  // Customer
  changePassword: 'Змінити пароль',
  changeUserData: 'Змінити дані користувача',
  changeDeliveryAddress: 'Змінити адресу доставки',
  favorites: 'Улюблені товари',
  ordersHistroy: 'Історія замовлень',
};

/**
 * ⚙️ Универсальная функция для генерации меню по роли
 */
export const getMenuItemsByRole = (role: UserRole) => {
  const routesMap =
    role === UserRole.ADMIN ? routes.adminRoutes : routes.customerRoutes;

  return Object.entries(routesMap).map(([key, path]) => ({
    key,
    title: titleMap[key] ?? key,
    icon: iconMap[key] ?? <MdDashboard />,
    path,
  }));
};
