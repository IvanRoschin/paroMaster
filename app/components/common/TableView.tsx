'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaPen, FaTrash } from 'react-icons/fa';

import { useGoodDelete } from '@/app/hooks';
import { formatCurrency } from '@/app/utils/formatCurrency';
import { Button, DeleteConfirmation, Modal } from '@/components';
import { IGoodUI } from '@/types';
import { UserRole } from '@/types/IUser';

interface TableViewProps {
  goods: IGoodUI[];
  role: UserRole;
}

export const TableView = ({ goods, role }: TableViewProps) => {
  const { goodToDelete, handleDelete, handleDeleteConfirm, deleteModal } =
    useGoodDelete();

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="p-3 font-medium">Фото</th>
            <th className="p-3 font-medium">Назва</th>
            <th className="p-3 font-medium">Категорія</th>
            <th className="p-3 font-medium">Бренд</th>
            <th className="p-3 text-right font-medium">Ціна</th>
            <th className="p-3 text-center font-medium">Наявність</th>
            <th className="p-3 text-center font-medium w-24">Дії</th>
          </tr>
        </thead>

        <tbody>
          {goods.map(good => (
            <tr
              key={good._id}
              className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Фото */}
              <td className="p-3">
                <div className="relative w-12 h-12">
                  <Image
                    src={good.src?.[0] || '/placeholder.png'}
                    alt={good.title}
                    fill
                    className="object-contain rounded-md bg-gray-100"
                  />
                </div>
              </td>

              {/* Назва */}
              <td className="p-3 font-medium text-gray-800">{good.title}</td>

              {/* Категорія */}
              <td className="p-3 text-gray-600">
                {good.category?.name ?? '-'}
              </td>

              {/* Бренд */}
              <td className="p-3 text-gray-600">{good.brand?.name ?? '-'}</td>

              {/* Ціна */}
              <td className="p-3 text-right font-semibold">
                {formatCurrency(good.price)}
              </td>

              {/* Наявність */}
              <td className="p-3 text-center">
                {good.isAvailable ? (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    В наявності
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                    Немає
                  </span>
                )}
              </td>

              {/* Дії */}
              <td className="p-3 text-center flex items-center justify-center gap-2">
                <Link
                  href={`/admin/goods/${good._id}`}
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

                <Button
                  type="button"
                  icon={FaTrash}
                  small
                  outline
                  color="border-red-400"
                  onClick={() =>
                    good._id && handleDelete(good._id.toString(), good.title)
                  }
                />
              </td>
            </tr>
          ))}

          {goods.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="p-6 text-center text-gray-500 italic bg-gray-50"
              >
                Немає товарів для відображення
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Модалка для підтвердження видалення */}
      <Modal
        body={
          <DeleteConfirmation
            onConfirm={handleDeleteConfirm}
            onCancel={() => deleteModal.onClose()}
            title={`товар: ${goodToDelete?.title}`}
          />
        }
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
      />
    </div>
  );
};
