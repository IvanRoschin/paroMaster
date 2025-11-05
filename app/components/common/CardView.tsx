'use client';
import Link from 'next/link';

import { useGoodDelete } from '@/app/hooks';
import {
  Button,
  DeleteConfirmation,
  Modal,
  NextImage,
  ProductCard,
} from '@/components';
import { IGoodUI } from '@/types';
import { UserRole } from '@/types/IUser';

type ListViewProps = {
  goods: IGoodUI[];
  role: UserRole;
};
export const CardView = ({ goods, role }: ListViewProps) => {
  const { goodToDelete, handleDelete, handleDeleteConfirm, deleteModal } =
    useGoodDelete();

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {goods.map((good, i) => (
        <div key={good._id || i}>
          {role === UserRole.ADMIN ? (
            <div className="p-3 border rounded-xl flex flex-col hover:shadow-md transition-shadow bg-white">
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
                  {good.price} ₴
                </div>
              </div>

              {/* Действия */}
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100 gap-2 w-full">
                <div className="flex-1 flex justify-start">
                  <Link
                    href={`/admin/goods/${good._id}`}
                    className="inline-block"
                  >
                    <Button
                      type="button"
                      small
                      outline
                      color="border-yellow-400"
                      label="Редагувати"
                    />
                  </Link>
                </div>
                <div className="flex-1 flex justify-end">
                  <Button
                    type="button"
                    small
                    outline
                    label="Видалити"
                    color="border-red-400"
                    onClick={() =>
                      good._id && handleDelete(good._id.toString(), good.title)
                    }
                  />
                </div>
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
