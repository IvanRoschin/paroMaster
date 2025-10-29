'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';

import { deleteUser, getAllUsers, updateUser } from '@/actions/users';
import {
  Breadcrumbs,
  Button,
  DeleteConfirmation,
  EmptyState,
  ErrorMessage,
  Loader,
  Modal,
  Pagination,
  Switcher,
} from '@/components/index';
import { useDeleteData, useDeleteModal, useFetchData } from '@/hooks/index';
import { ISearchParams, IUser } from '@/types/index';

export default function Users({
  searchParams,
}: {
  searchParams: ISearchParams;
}) {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
    surname: string;
  } | null>(null);
  const { data, isLoading, isError, error, refetch } = useFetchData(
    getAllUsers,
    ['users'],
    {
      status: statusFilter,
    }
  );

  const { mutate: deleteUserById } = useDeleteData(deleteUser, [
    'users',
    userToDelete?.id,
  ]);

  const deleteModal = useDeleteModal();

  const handleDelete = (id: string, name: string, surname: string) => {
    setUserToDelete({ id, name, surname });
    deleteModal.onOpen();
  };

  const handleDeleteConfirm = () => {
    if (userToDelete?.id) {
      deleteUserById(userToDelete.id);
      deleteModal.onClose();
    }
  };

  const handleStatusToggle = async (
    _id: string | undefined,
    isActive: boolean
  ) => {
    if (!_id) {
      toast.error('Invalid testimonial ID.');
      return;
    }
    try {
      const values = { _id, isActive: !isActive };
      await updateUser(values as Partial<IUser> & { _id: string });
      refetch();
      toast.success('Статус користувача змінено!');
    } catch (error) {
      toast.error('Unknown error occurred.');
      console.error('Error updating testimonial status:', error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  if (!data?.users || data.users.length === 0) {
    return (
      <EmptyState
        title="Адміни відсутні"
        actionLabel="Додати першого адміна"
        actionHref="/admin/users/add"
      />
    );
  }

  const usersCount = data?.count || 0;

  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = Number(searchParams.limit) || 10;
  const totalPages = Math.ceil(usersCount / limit);
  const pageNumbers = [];
  const offsetNumber = 3;

  if (page) {
    for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
      if (i >= 1 && i <= totalPages) {
        pageNumbers.push(i);
      }
    }
  }

  return (
    <div className="p-3 rounded-xl">
      <Breadcrumbs />

      <div className="flex items-center justify-between mb-8">
        {/* <Search placeholder="Знайти товар" /> */}
        <p className=" text-lg">
          {' '}
          Додай нового <span className="subtitle text-lg">{'адміна =>'}</span>
        </p>{' '}
        <Link href="/admin/users/add">
          <Button
            type={'submit'}
            label="Додати"
            small
            outline
            color="border-green-400"
          />
        </Link>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-300 font-semibold">
            <td className="p-2 border-r-2 text-center">Ім&apos;я</td>
            <td className="p-2 border-r-2 text-center">Email</td>
            <td className="p-2 border-r-2 text-center">Телефон</td>
            <td className="p-2 border-r-2 text-center">Створений</td>
            <td className="p-2 border-r-2 text-center">Роль</td>
            <td className="p-2 border-r-2 text-center">Статус</td>
            <td className="p-2 border-r-2 text-center">Редагувати</td>
            <td className="p-2 border-r-2 text-center">Видалити</td>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user: IUser) => {
            return (
              <tr key={user._id} className="border-b-2">
                <td className="p-2 border-r-2 text-center">{user.name}</td>
                <td className="p-2 border-r-2 text-center">{user.email}</td>
                <td className="p-2 border-r-2 text-center">{user.phone}</td>
                <td className="p-2 border-r-2 text-center">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('uk-UA')
                    : '-'}
                </td>
                <td className="p-2 border-r-2 text-center">
                  {user.isAdmin ? 'admin' : 'user'}
                </td>
                <td className="p-2 border-r-2 text-center">
                  <Switcher
                    checked={user.isActive}
                    onChange={() =>
                      user._id && handleStatusToggle(user._id, user.isActive)
                    }
                  />
                </td>
                <td className="p-2 border-r-2 text-center">
                  <Link
                    href={`/admin/users/${user._id}`}
                    className="flex items-center justify-center"
                  >
                    <Button
                      type={'submit'}
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
                    onClick={() =>
                      user._id &&
                      handleDelete(user._id.toString(), user.name, user.surname)
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {totalPages > 1 && (
        <Pagination count={usersCount} pageNumbers={pageNumbers} />
      )}
      {/* Модалка для підтвердження видалення */}
      <Modal
        body={
          <DeleteConfirmation
            onConfirm={handleDeleteConfirm}
            onCancel={() => deleteModal.onClose()}
            title={`адміна: ${userToDelete?.name} &nbsp; ${userToDelete?.surname}`}
          />
        }
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
      />
    </div>
  );
}
