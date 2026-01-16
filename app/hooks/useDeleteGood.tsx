'use client';
import { useState } from 'react';
import { toast } from 'sonner';

import { deleteGoodAction } from '@/app/actions/goods';
import { useDeleteData } from '@/app/hooks';

import { useModal } from './useModal';

export function useGoodDelete(refetch?: () => void, queryKey?: any) {
  const [goodToDelete, setGoodToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { isOpen, open, close } = useModal('delete');

  const { mutate: deleteGoodById } = useDeleteData(
    deleteGoodAction,
    queryKey ?? ['goods']
  );

  const handleDelete = (id: string, title: string) => {
    setGoodToDelete({ id, title });
    open();
  };

  const handleDeleteConfirm = (title: string) => {
    if (!goodToDelete?.id) return;

    deleteGoodById(goodToDelete.id, {
      onSuccess: () => {
        toast.success(`Товар: ${title} видалено`);
        close();
        if (refetch) refetch();
      },
    });
  };

  return {
    goodToDelete,
    handleDelete,
    handleDeleteConfirm,
  };
}
