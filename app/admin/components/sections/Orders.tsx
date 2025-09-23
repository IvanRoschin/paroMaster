'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';

import { deleteOrder, getAllOrders } from '@/actions/orders';
import {
  Breadcrumbs,
  Button,
  EmptyState,
  ErrorMessage,
  Loader,
  Pagination,
} from '@/components/index';
import { formatDate } from '@/helpers/index';
import { useDeleteData, useFetchData } from '@/hooks/index';

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const { mutate: deleteOrderById } = useDeleteData(deleteOrder, ['orders']);
  const { data, isLoading, isError, error } = useFetchData(
    getAllOrders,
    ['orders'],
    {
      limit,
      page,
      status: statusFilter,
      sort: '-createdAt',
    }
  );

  if (!data || isLoading) return <Loader />;
  if (isError) return <ErrorMessage error={error} />;

  if (!data?.orders || data.orders.length === 0) {
    return (
      <EmptyState
        showReset
        title="Відсутні замовлення 🤷‍♂️"
        onReset={() => setStatusFilter(null)}
      />
    );
  }

  const ordersCount = data.count || 0;
  const totalPages = Math.ceil(ordersCount / limit);
  const pageNumbers = [];
  const offsetNumber = 3;

  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) pageNumbers.push(i);
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Новий':
        return 'bg-blue-100 text-blue-800';
      case 'Опрацьовується':
        return 'bg-yellow-100 text-yellow-800';
      case 'Оплачений':
        return 'bg-green-100 text-green-800';
      case 'На відправку':
        return 'bg-purple-100 text-purple-800';
      case 'Закритий':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleDelete = (id: string) => {
    deleteOrderById(id);
  };

  return (
    <div className="p-3">
      <Breadcrumbs />

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <p className="text-lg">
          Всього в базі <span className="subtitle text-lg">{ordersCount}</span>{' '}
          замовлення(-нь)
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={statusFilter || ''}
            onChange={e => setStatusFilter(e.target.value || null)}
            className="border border-gray-300 rounded p-2 text-sm"
          >
            <option value="">Всі статуси</option>
            <option value="Новий">Новий</option>
            <option value="Опрацьовується">Опрацьовується</option>
            <option value="Оплачений">Оплачений</option>
            <option value="На відправку">На відправку</option>
            <option value="Закритий">Закритий</option>
          </select>

          <Link href="/admin/orders/add">
            <Button label="Додати" small outline color="border-green-400" />
          </Link>
        </div>
      </div>

      {/* Список замовлень */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.orders?.map(order => (
          <div
            key={order._id}
            className="bg-white rounded shadow-md p-4 relative"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-sm">
                  Замовлення №{order.number}
                </h3>
                <p className="text-xs text-gray-500">
                  {formatDate(order?.createdAt)}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded ${getStatusStyle(order.status)}`}
              >
                {order.status}
              </span>
            </div>

            <div className="text-sm text-gray-800 mb-2 space-y-1">
              <p>
                <strong>Ім’я:</strong> {order.customer.name}
              </p>
              <p>
                <strong>Телефон:</strong> {order.customer.phone}
              </p>
              <p>
                <strong>Місто:</strong> {order.customer.city}
              </p>
              <p>
                <strong>Склад:</strong> {order.customer.warehouse}
              </p>
              <p>
                <strong>Оплата:</strong> {order.customer.payment}
              </p>
            </div>

            <ul className="text-xs text-gray-600 list-disc pl-5 mb-2">
              {order.orderedGoods.map(good => (
                <li key={good._id}>
                  {good.title} ({good.brand}) — {good.quantity} × {good.price}{' '}
                  грн
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">
                Сума: {order.totalPrice} грн
              </span>
              <div className="flex gap-2">
                <Link href={`/admin/orders/${order._id}`}>
                  <Button
                    icon={FaPen}
                    small
                    outline
                    color="border-yellow-400"
                  />
                </Link>
                <Button
                  icon={FaTrash}
                  small
                  outline
                  color="border-red-400"
                  onClick={() => order?._id && handleDelete(order._id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination count={ordersCount} pageNumbers={pageNumbers} />
        </div>
      )}
    </div>
  );
}
