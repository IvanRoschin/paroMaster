'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';

import {
  Button,
  CompareButton,
  DeleteConfirmation,
  FavoriteButton,
  Modal,
  NextImage,
} from '@/app/components';
import { useGoodDelete } from '@/app/hooks';
import { useModal } from '@/app/hooks/useModal';
import { useAppStore } from '@/app/store/appStore';
import { formatCurrency } from '@/app/utils/formatCurrency';
import { IGoodUI, ISearchParams } from '@/types';
import { UserRole } from '@/types/IUser';

type ListViewProps = {
  goods: IGoodUI[];
  role: UserRole;
  refetch?: () => void;
  searchParams: ISearchParams;
};

export const ListView = ({
  goods,
  role,
  refetch,
  searchParams,
}: ListViewProps) => {
  const { goodToDelete, handleDelete, handleDeleteConfirm } = useGoodDelete(
    refetch,
    ['goods', searchParams]
  );

  const { isOpen, open, close } = useModal('delete');

  const { cart } = useAppStore();

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const q: Record<string, number> = {};
    goods.forEach(g => (q[g._id] = cart.getItemQuantity(g._id)));
    setQuantities(q);
  }, [goods, cart]);

  return (
    <ul className="divide-y divide-gray-200">
      <AnimatePresence mode="popLayout">
        {goods.map(good => {
          const quantity = quantities[good._id] ?? 0;

          return (
            <motion.li
              key={good._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-md"
            >
              <NextImage
                src={good.src?.[0] || '/placeholder.png'}
                alt={good.title}
                width={40}
                height={40}
                useSkeleton
                className="rounded bg-gray-100"
              />

              {/* Название и бренд */}

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  <Link
                    className="nav text-gray-600 hover:text-gray-600"
                    href={`/catalog/${good._id}`}
                  >
                    {good.title}{' '}
                  </Link>
                </div>
                <div className="text-gray-500 text-sm truncate">
                  {good.brand?.name ?? '—'}
                </div>
              </div>

              {/* Цена */}
              <div className="text-right font-semibold w-24 shrink-0">
                {formatCurrency(good.price, 'uk-UA', 'UAH')}
              </div>

              {/* Статус наличия */}
              <div className="w-24 text-center shrink-0">
                {good.isAvailable ? (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    В наявності
                  </span>
                ) : (
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    Немає
                  </span>
                )}
              </div>

              {/* Действия / корзина */}
              <div className="shrink-0 flex items-center justify-center gap-2 w-32">
                {role === UserRole.ADMIN ? (
                  <>
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
                        good._id &&
                        handleDelete(good._id.toString(), good.title)
                      }
                    />
                  </>
                ) : (
                  <div className="shrink-0 flex flex-col items-center justify-center gap-1">
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
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>

      {/* Модалка для підтвердження видалення */}
      <Modal
        body={
          <DeleteConfirmation
            onConfirm={() => handleDeleteConfirm(goodToDelete?.title || '')}
            onCancel={close}
            title={`товар: ${goodToDelete?.title}`}
          />
        }
        isOpen={isOpen}
        onClose={close}
      />
    </ul>
  );
};

// === Компонент управления корзиной ===
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
            <span className="w-5 text-center text-sm">{quantity}</span>
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
