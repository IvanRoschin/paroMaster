'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';

import { deleteCustomerAction, getAllCustomersAction } from '@/app/actions';
import { paymentMethods } from '@/app/config/constants';
import { useModal } from '@/app/hooks/useModal';
import {
  Button,
  DeleteConfirmation,
  EmptyState,
  ErrorMessage,
  Loader,
  Modal,
  Pagination,
} from '@/components/index';
import { useDeleteData, useFetchData } from '@/hooks/index';
import { ICustomerUI } from '@/types/ICustomer';
import { ISearchParams } from '@/types/searchParams';

interface CustomersProps {
  params: ISearchParams;
}

export default function Customers({ params }: CustomersProps) {
  const [customerToDelete, setCustomerToDelete] = useState<{
    id: string;
    name: string;
    surname: string;
  } | null>(null);

  const { isOpen, open, close } = useModal('delete');

  const { data, isLoading, isError, error } = useFetchData(
    getAllCustomersAction,
    ['customers'],
    params
  );

  const { mutate: deleteCustomerById } = useDeleteData(deleteCustomerAction, [
    'customers',
  ]);

  const handleDelete = (customer: ICustomerUI) => {
    if (!customer._id) return;

    setCustomerToDelete({
      id: customer._id,
      name: customer.user?.name || '',
      surname: customer.user?.surname || '',
    });

    open();
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete?.id) {
      deleteCustomerById(customerToDelete.id);
      close();
    }
  };

  // ----------- Статусы запроса -----------
  if (!data || isLoading) return <Loader />;
  if (isError) return <ErrorMessage error={error} />;

  // ----------- Если клиентов нет -----------
  const customers = data.customers ?? [];
  if (customers.length === 0) {
    return (
      <EmptyState
        title="Замовники відсутні"
        subtitle="Додайте замовника"
        actionLabel="Додати замовника"
        actionHref="/admin/customers/add"
      />
    );
  }

  // ----------- Пагинация -----------
  const count = data.count || 0;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;

  const totalPages = Math.ceil(count / limit);
  const offset = 3;

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, idx) => idx + 1
  ).filter(p => p >= page - offset && p <= page + offset);

  // ----------- Render -----------
  return (
    <div className="p-3">
      <Header count={count} />

      <table className="w-full text-xs mb-8">
        <TableHeader />

        <tbody>
          {customers.map(customer => (
            <CustomerRow
              key={customer._id}
              customer={customer}
              onDelete={() => handleDelete(customer)}
            />
          ))}
        </tbody>
      </table>

      {totalPages > 1 && <Pagination count={count} pageNumbers={pageNumbers} />}

      <Modal
        body={
          <DeleteConfirmation
            onConfirm={handleDeleteConfirm}
            onCancel={close}
            title={`замовника: ${customerToDelete?.name} ${customerToDelete?.surname}`}
          />
        }
        isOpen={isOpen}
        onClose={close}
      />
    </div>
  );
}

//
// ------------------------------
//      Компоненты
// ------------------------------
//

const Header = ({ count }: { count: number }) => (
  <div className="flex items-center justify-between mb-8">
    <p className="text-lg">
      Всього в базі <span className="subtitle text-lg">{count}</span>{' '}
      клієнта(-ів)
    </p>

    <Link href="/admin/customers/add">
      <Button
        type="button"
        label="Додати"
        small
        outline
        color="border-green-400"
      />
    </Link>
  </div>
);

const TableHeader = () => (
  <thead>
    <tr className="bg-slate-300 font-semibold">
      <td className="p-2 border-r-2 text-center">Імʼя та Прізвище</td>
      <td className="p-2 border-r-2 text-center">Телефон</td>
      <td className="p-2 border-r-2 text-center">E-mail</td>
      <td className="p-2 border-r-2 text-center">Місто</td>
      <td className="p-2 border-r-2 text-center">Склад</td>
      <td className="p-2 border-r-2 text-center">Спосіб оплати</td>
      <td className="p-2 border-r-2 text-center">Редагувати</td>
      <td className="p-2 text-center">Видалити</td>
    </tr>
  </thead>
);

const CustomerRow = ({
  customer,
  onDelete,
}: {
  customer: ICustomerUI;
  onDelete: () => void;
}) => {
  const { _id, city, warehouse, payment, user } = customer;
  const getPaymentLabel = (id: string) => {
    const method = paymentMethods.find(pm => pm.id === id);
    return method ? method.label : id;
  };

  return (
    <tr className="border-b-2">
      <td className="p-2 border-r-2 text-start">
        {user?.name} {user?.surname}
      </td>
      <td className="p-2 border-r-2 text-start">{user?.phone}</td>
      <td className="p-2 border-r-2 text-start">{user?.email}</td>
      <td className="p-2 border-r-2 text-center">{city}</td>
      <td className="p-2 border-r-2 text-center">{warehouse}</td>
      <td className="p-2 border-r-2 text-center">{getPaymentLabel(payment)}</td>

      <td className="p-2 border-r-2 text-center">
        <Link
          href={`/admin/customers/${_id}`}
          className="flex items-center justify-center"
        >
          <Button
            type="button"
            icon={FaPen}
            small
            outline
            color="border-yellow-400"
          />
        </Link>
      </td>

      <td className="p-2 text-center">
        <Button
          type="button"
          icon={FaTrash}
          small
          outline
          color="border-red-400"
          onClick={onDelete}
        />
      </td>
    </tr>
  );
};
