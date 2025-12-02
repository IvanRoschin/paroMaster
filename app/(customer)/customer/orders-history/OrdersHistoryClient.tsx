'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { NextImage } from '@/app/components';
import { orderStatus, paymentMethods } from '@/app/config/constants';
import { formatCurrency } from '@/app/utils/formatCurrency';
import { IOrder } from '@/types/IOrder';

interface OrdersHistoryClientProps {
  orders: IOrder[];
}

export default function OrdersHistoryClient({
  orders,
}: OrdersHistoryClientProps) {
  const getPaymentLabel = (id: string) =>
    paymentMethods.find(pm => pm.id === id)?.label ?? id;

  const getStatusLabel = (id: string) =>
    orderStatus.find(os => os.id === id)?.label ?? id;

  const sortedOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) =>
        new Date(b.createdAt || '').getTime() -
        new Date(a.createdAt || '').getTime()
    );
  }, [orders]);

  if (!orders.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        У вас поки немає замовлень
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <h1 className="subtitle mb-6">Історія замовлень</h1>

      {sortedOrders.map(order => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <div>
              <p className="text-lg font-semibold">
                Замовлення № {order.number ?? order._id}
              </p>

              <p className="text-sm text-gray-500">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Дата невідома'}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600 border border-blue-200">
              {getStatusLabel(order.status || 'NEW')}
            </span>
          </div>

          {/* CUSTOMER SNAPSHOT */}
          <div className="mb-4 text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-medium">Покупець:</span>{' '}
              {order.customerSnapshot.user.name}{' '}
              {order.customerSnapshot.user.surname}
            </p>
            <p>
              <span className="font-medium">Телефон:</span>{' '}
              {order.customerSnapshot.user.phone}
            </p>
            <p>
              <span className="font-medium">Доставка:</span>{' '}
              {order.customerSnapshot.city}, {order.customerSnapshot.warehouse}
            </p>
            <p>
              <span className="font-medium">Оплата:</span>{' '}
              {getPaymentLabel(order.customerSnapshot.payment)}
            </p>
          </div>

          {/* GOODS LIST */}
          <div className="rounded-xl border divide-y bg-gray-50">
            {order.orderedGoods.map((item, index) => {
              const good = isGood(item.good) ? item.good : null;
              return (
                <div
                  key={index}
                  className="p-4 flex justify-between items-center gap-4"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    {/* IMAGE */}
                    <div className="w-16 h-16 bg-white border rounded-lg overflow-hidden flex items-center justify-center">
                      {good?.src?.[0] ? (
                        <NextImage
                          src={good.src?.[0] ?? '/placeholder.png'}
                          alt={good.title ?? 'Товар'}
                          fill
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">Нема фото</span>
                      )}
                    </div>

                    {/* INFO */}
                    <div className="flex flex-col">
                      <p className="font-medium">
                        {good?.title ?? (
                          <span className="text-gray-500 italic">
                            Товар видалений
                          </span>
                        )}
                      </p>

                      <p className="text-gray-500 text-sm">
                        Кількість: {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* PRICE */}
                  <p className="font-semibold whitespace-nowrap">
                    {formatCurrency(item.price * item.quantity, 'uk-UA', 'UAH')}
                  </p>
                </div>
              );
            })}
          </div>

          {/* TOTAL */}
          <div className="flex justify-end mt-4">
            <p className="text-lg font-bold">
              Всього: {formatCurrency(order.totalPrice, 'uk-UA', 'UAH')}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  function isGood(obj: any): obj is { src?: string[]; title?: string } {
    return obj && typeof obj === 'object' && 'title' in obj;
  }
}
