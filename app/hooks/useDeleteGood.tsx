'use client';
import { useState } from 'react';
import { toast } from 'sonner';

import { deleteGood } from '@/app/actions/goods';
import { useDeleteData, useDeleteModal } from '@/app/hooks';

export function useGoodDelete(refetch?: () => void, queryKey?: any) {
  const [goodToDelete, setGoodToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const deleteModal = useDeleteModal();

  const { mutate: deleteGoodById } = useDeleteData(
    deleteGood,
    queryKey ?? ['goods']
  );

  const handleDelete = (id: string, title: string) => {
    setGoodToDelete({ id, title });
    deleteModal.onOpen();
  };

  const handleDeleteConfirm = (title: string) => {
    if (!goodToDelete?.id) return;

    deleteGoodById(goodToDelete.id, {
      onSuccess: () => {
        toast.success(`Товар: ${title} видалено`);
        deleteModal.onClose();
        if (refetch) refetch();
      },
    });
  };

  return {
    goodToDelete,
    handleDelete,
    handleDeleteConfirm,
    deleteModal,
  };
}
