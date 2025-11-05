'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { FaPen, FaTrash } from 'react-icons/fa';

import { Button, DeleteConfirmation, Modal, NextImage } from '@/app/components';
import { useGoodDelete } from '@/app/hooks';
import { IGoodUI } from '@/types';
import { UserRole } from '@/types/IUser';

type ListViewProps = {
  goods: IGoodUI[];
  role: UserRole;
};

export const ListView = ({ goods, role }: ListViewProps) => {
  const { goodToDelete, handleDelete, handleDeleteConfirm, deleteModal } =
    useGoodDelete();
  return (
    <ul className="divide-y divide-gray-200">
      <AnimatePresence mode="popLayout">
        {goods.map(good => (
          <motion.li
            key={good._id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-md cursor-pointer"
          >
            <NextImage
              src={good.src?.[0] || '/placeholder.png'}
              alt={good.title}
              width={40}
              height={40}
              useSkeleton
              className="rounded bg-gray-100"
            />
            <div className="flex-1">
              <div className="font-medium">{good.title},</div>
              <div className="text-gray-500 text-sm">{good.brand?.name}</div>
            </div>
            <div className="text-right font-semibold">{good.price} ₴</div>
            <div></div>
            <div className="p-2 border-r-2 text-center">
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
            </div>
            <div className="p-2 text-center">
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
          </motion.li>
        ))}
      </AnimatePresence>
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
    </ul>
  );
};
