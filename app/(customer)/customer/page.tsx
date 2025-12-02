'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/app/helpers/routes';

type Props = {};

const sections = [
  {
    title: 'Особисті дані',
    description: 'Переглянути та оновити особисту інформацію',
    href: `${routes.customerRoutes.changeUserData}`,
  },
  {
    title: 'Адреса доставки',
    description: 'Оновити місто, відділення та спосіб оплати',
    href: `${routes.customerRoutes.changeDeliveryAddress}`,
  },
  {
    title: 'Пароль',
    description: 'Змінити пароль акаунту',
    href: `${routes.customerRoutes.changePassword}`,
  },
  {
    title: 'Обрані товари',
    description: 'Переглянути збережені товари',
    href: `${routes.customerRoutes.favorites}`,
  },
  {
    title: 'Історія замовлень',
    description: 'Переглянути статус та деталі замовлень',
    href: `${routes.customerRoutes.ordersHistroy}`,
  },
];

const CustomerPage = (props: Props) => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Особистий кабінет
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-600 mb-8"
      >
        Керуйте своїми даними, замовленнями та налаштуваннями аккаунту.
      </motion.p>

      {/* GRID OF OPTIONS */}
      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((el, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={el.href}
              className="block border rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition group"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg subtitle transition">{el.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{el.description}</p>
                </div>

                <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CustomerPage;
