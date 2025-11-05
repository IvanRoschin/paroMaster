'use client';
import { useState } from 'react';

import { deleteGood } from '@/app/actions/goods';
import { useDeleteData, useDeleteModal } from '@/app/hooks';

export function useGoodDelete() {
  const [goodToDelete, setGoodToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const deleteModal = useDeleteModal();
  const { mutate: deleteGoodById } = useDeleteData(deleteGood, [
    'good',
    goodToDelete?.id,
  ]);

  const handleDelete = (id: string, title: string) => {
    setGoodToDelete({ id, title });
    deleteModal.onOpen();
  };

  const handleDeleteConfirm = () => {
    if (goodToDelete?.id) {
      deleteGoodById(goodToDelete.id);
      deleteModal.onClose();
    }
  };

  return {
    goodToDelete,
    handleDelete,
    handleDeleteConfirm,
    deleteModal,
  };
}
