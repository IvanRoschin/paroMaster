'use client';
import Link from 'next/link';
import { FaPen, FaTrash } from 'react-icons/fa';

import { useGoodDelete } from '@/app/hooks';
import { useModal } from '@/app/hooks/useModal';
import { formatCurrency } from '@/app/utils/formatCurrency';
import {
  Button,
  DeleteConfirmation,
  Modal,
  NextImage,
  ProductCard,
} from '@/components';
import { IGoodUI, ISearchParams } from '@/types';
import { UserRole } from '@/types/IUser';

type CardViewProps = {
  goods: IGoodUI[];
  role: UserRole;
  refetch?: () => void;
  searchParams: ISearchParams;
};
export const CardView = ({
  goods,
  role,
  refetch,
  searchParams,
}: CardViewProps) => {
  const { goodToDelete, handleDelete, handleDeleteConfirm } = useGoodDelete(
    refetch,
    ['goods', searchParams]
  );
  const { isOpen, open, close } = useModal('delete');

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
      {goods.map((good, i) => (
        <div key={good._id || i}>
          {role === UserRole.ADMIN ? (
            <div className="p-3 border rounded-xl flex flex-col hover:shadow-md transition-shadow bg-white h-full min-h-[420px]">
              <Link href={`/catalog/${good._id}`}>
                {/* Изображение */}
                <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                  <NextImage
                    useSkeleton
                    src={good.src?.[0] || '/placeholder.png'}
                    alt={good.title}
                    width={300}
                    height={200}
                    className="object-contain w-full h-full"
                  />
                </div>

                {/* Контент */}
                <div className="flex flex-col flex-grow mt-3">
                  <div className="flex-1 space-y-1 text-sm">
                    <span className="font-semibold line-clamp-2">
                      {good.title}
                    </span>
                    <span className="text-gray-500">
                      {good.brand?.name ?? '-'}
                    </span>
                  </div>
                  <div className="mt-2 text-primaryAccentColor font-bold text-lg">
                    {formatCurrency(good.price, 'uk-UA', 'UAH')}
                  </div>
                </div>
              </Link>

              {/* Действия */}
              <div className="mt-auto flex justify-evenly items-center pt-4 border-t border-gray-100 gap-2 w-full">
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
              </div>
            </div>
          ) : (
            <ProductCard
              good={{
                ...good,
                compatibleGoods: Array.isArray(good.compatibleGoods)
                  ? good.compatibleGoods.filter(
                      (g): g is IGoodUI => typeof g !== 'string'
                    )
                  : [],
              }}
            />
          )}
        </div>
      ))}

      {/* Модалка для подтверждения удаления */}
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
    </div>
  );
};
