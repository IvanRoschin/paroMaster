'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';

import { useGoodDelete } from '@/app/hooks';
import { useAppStore } from '@/app/store/appStore';
import { formatCurrency } from '@/app/utils/formatCurrency';
import {
  Button,
  CompareButton,
  DeleteConfirmation,
  FavoriteButton,
  Modal,
  NextImage,
} from '@/components';
import { IGoodUI, ISearchParams } from '@/types';
import { UserRole } from '@/types/IUser';

interface TableViewProps {
  goods: IGoodUI[];
  role: UserRole;
  refetch?: () => void;
  searchParams: ISearchParams;
}

export const TableView = ({
  goods,
  role,
  refetch,
  searchParams,
}: TableViewProps) => {
  const { goodToDelete, handleDelete, handleDeleteConfirm, deleteModal } =
    useGoodDelete(refetch, ['goods', searchParams]);

  const { cart } = useAppStore();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const newQuantities: Record<string, number> = {};
    goods.forEach(good => {
      newQuantities[good._id] = cart.getItemQuantity(good._id);
    });
    setQuantities(newQuantities);
  }, [goods, cart]);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="p-2 font-medium">Фото</th>
            <th className="p-2 font-medium">Назва</th>
            <th className="p-2 font-medium">Категорія</th>
            <th className="p-2 font-medium">Бренд</th>
            <th className="p-2 text-right font-medium">Ціна</th>
            <th className="p-2 text-center font-medium">Наявність</th>
            <th className="p-2 text-center font-medium w-36">
              {role === UserRole.ADMIN ? 'Дії' : 'Покупка'}
            </th>
          </tr>
        </thead>

        <tbody>
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

          {goods.map(good => {
            const quantity = quantities[good._id] ?? 0;

            return (
              <tr
                key={good._id}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* Фото */}
                <td className="p-2 w-12">
                  <NextImage
                    width={36}
                    height={36}
                    useSkeleton
                    src={good.src?.[0] || '/placeholder.png'}
                    alt={good.title}
                    className="object-contain rounded-md bg-gray-100"
                  />
                </td>

                {/* Назва */}
                <td className="p-2 font-medium text-gray-800 max-w-[150px] truncate">
                  <Link
                    className="nav text-gray-600 hover:text-gray-600"
                    href={`/catalog/${good._id}`}
                  >
                    {good.title}
                  </Link>
                </td>

                {/* Категорія */}
                <td className="p-2 text-gray-600 max-w-[120px] truncate">
                  {good.category?.name ?? '-'}
                </td>

                {/* Бренд */}
                <td className="p-2 text-gray-600 max-w-[120px] truncate">
                  {good.brand?.name ?? '-'}
                </td>

                {/* Ціна */}
                <td className="p-2 text-right font-semibold">
                  {formatCurrency(good.price, 'uk-UA', 'UAH')}
                </td>

                {/* Наявність */}
                <td className="p-2 text-center">
                  {good.isAvailable ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                      В наявності
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                      Немає
                    </span>
                  )}
                </td>

                {/* Действия или корзина */}
                <td className="p-2 text-center">
                  {role === UserRole.ADMIN ? (
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`/admin/goods/${good._id}`}>
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
                          good._id &&
                          handleDelete(good._id.toString(), good.title)
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <CartActions
                        goodId={good._id}
                        isAvailable={good.isAvailable}
                        quantity={quantity}
                        increaseCartQuantity={cart.increaseCartQuantity}
                        decreaseCartQuantity={cart.decreaseCartQuantity}
                        removeFromCart={cart.removeFromCart}
                      />
                      <div className="flex gap-1 mt-1">
                        <FavoriteButton good={good} />
                        <CompareButton good={good} />
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Модалка удаления */}
      <Modal
        body={
          <DeleteConfirmation
            onConfirm={() => handleDeleteConfirm(goodToDelete?.title || '')}
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

// --- Компонент действий корзины ---
interface CartActionsProps {
  goodId: string;
  isAvailable: boolean;
  quantity: number;
  increaseCartQuantity: (id: string) => void;
  decreaseCartQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
}

const CartActions = ({
  goodId,
  isAvailable,
  quantity,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeFromCart,
}: CartActionsProps) => {
  if (!isAvailable) {
    return (
      <span className="text-xs text-gray-400 italic">Немає в наявності</span>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      {quantity === 0 ? (
        <Button
          type="button"
          label="Купити"
          width="24"
          small
          onClick={() => increaseCartQuantity(goodId)}
        />
      ) : (
        <>
          <div className="flex items-center gap-1 justify-center">
            <Button
              type="button"
              label="-"
              small
              outline
              onClick={() => decreaseCartQuantity(goodId)}
            />
            <span className="w-5 text-center text-sm font-semibold">
              {quantity}
            </span>
            <Button
              type="button"
              label="+"
              small
              outline
              onClick={() => increaseCartQuantity(goodId)}
            />
          </div>
          <Button
            type="button"
            label="Видалити"
            width="24"
            small
            onClick={() => removeFromCart(goodId)}
          />
        </>
      )}
    </div>
  );
};
