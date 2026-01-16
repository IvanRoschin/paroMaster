'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';

import {
  deleteUserAction,
  getAllUsersAction,
  updateUserAction,
} from '@/actions/users';
import { useModal } from '@/app/hooks/useModal';
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
import { useDeleteData, useFetchData } from '@/hooks/index';
import { ISearchParams, IUser } from '@/types/index';
import { UserRole } from '@/types/IUser';

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
    getAllUsersAction,
    ['users'],
    { status: statusFilter }
  );

  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data?.users) setUsers(data.users);
  }, [data?.users]);

  const { mutate: deleteUserById } = useDeleteData(deleteUserAction, ['users']);
  const { open, close, isOpen } = useModal('delete');

  const handleDelete = (id: string, name: string, surname: string) => {
    setUserToDelete({ id, name, surname });
    open();
  };

  const handleDeleteConfirm = () => {
    if (userToDelete?.id) {
      deleteUserById(userToDelete.id);
      close();
    }
  };

  const handleStatusToggle = async (_id: string, isActive: boolean) => {
    // Оптимистическое обновление
    setUsers(prev =>
      prev.map(u => (u._id === _id ? { ...u, isActive: !isActive } : u))
    );
    try {
      await updateUserAction(_id, { isActive: !isActive });
      toast.success(
        `Статус користувача ${!isActive ? 'активний' : 'неактивний'}!`
      );
      refetch();
    } catch (err) {
      toast.error('Помилка при зміні статусу.');
      console.error(err);
    }
  };

  const handleRoleToggle = async (_id: string, role: UserRole) => {
    const newRole: UserRole =
      role === UserRole.ADMIN ? UserRole.CUSTOMER : UserRole.ADMIN;
    setUsers(prev =>
      prev.map(u => (u._id === _id ? { ...u, role: newRole } : u))
    );
    try {
      await updateUserAction(_id, { role: newRole });
      toast.success(`Роль змінена на ${newRole}!`);
      refetch();
    } catch (err) {
      toast.error('Помилка при зміні ролі.');
      console.error(err);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage error={error} />;
  if (!users || users.length === 0) {
    return (
      <EmptyState
        title="Користувачі відсутні"
        actionLabel="Додати користувача"
        actionHref="/admin/users/add"
      />
    );
  }

  const usersCount = data?.count || 0;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = Number(searchParams.limit) || 10;
  const totalPages = Math.ceil(usersCount / limit);
  const pageNumbers: number[] = [];
  const offsetNumber = 3;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) pageNumbers.push(i);
  }

  return (
    <div className="p-3 rounded-xl">
      <Breadcrumbs />

      <div className="flex items-center justify-between mb-8">
        <p className="text-lg">
          Додай нового{' '}
          <span className="subtitle text-lg">користувача =&gt;</span>
        </p>
        <Link href="/admin/users/add">
          <Button
            type="submit"
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
          {users.map(user => {
            const rowClass = user.isActive ? '' : 'bg-gray-100 text-gray-400';
            return (
              <tr key={user._id} className={`border-b-2 ${rowClass}`}>
                <td className="p-2 border-r-2 text-center">{user.name}</td>
                <td className="p-2 border-r-2 text-center">{user.email}</td>
                <td className="p-2 border-r-2 text-center">{user.phone}</td>
                <td className="p-2 border-r-2 text-center">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('uk-UA')
                    : '-'}
                </td>
                <td className="p-2 border-r-2 text-center">
                  <Switcher
                    checked={user.role === 'admin'}
                    onChange={() => handleRoleToggle(user._id!, user.role)}
                    labels={['customer', 'admin']}
                  />
                </td>
                <td className="p-2 border-r-2 text-center">
                  <Switcher
                    checked={user.isActive}
                    onChange={() =>
                      handleStatusToggle(user._id!, user.isActive)
                    }
                    labels={['неактивний', 'активний']}
                  />
                </td>
                <td className="p-2 border-r-2 text-center">
                  <Link
                    href={`/admin/users/${user._id}`}
                    className="flex items-center justify-center"
                  >
                    <Button
                      type="submit"
                      icon={FaPen}
                      small
                      outline
                      color="border-yellow-400"
                    />
                  </Link>
                </td>
                <td className="p-2 text-center">
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      icon={FaTrash}
                      small
                      outline
                      color="border-red-400"
                      onClick={() =>
                        handleDelete(user._id!, user.name, user.surname)
                      }
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Pagination count={usersCount} pageNumbers={pageNumbers} />
      )}

      <Modal
        body={
          <DeleteConfirmation
            onConfirm={handleDeleteConfirm}
            onCancel={close}
            title={`користувача: ${userToDelete?.name} ${userToDelete?.surname}`}
          />
        }
        isOpen={isOpen}
        onClose={close}
      />
    </div>
  );
}
