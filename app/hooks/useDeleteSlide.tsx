'use client';
import { useState } from 'react';
import { toast } from 'sonner';

import { deleteSlideAction } from '@/app/actions/slides';
import { useDeleteData } from '@/app/hooks';

import { useModal } from './useModal';

export function useSlideDelete(refetch?: () => void, queryKey?: any) {
  const [slideToDelete, setSlideToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const deleteModal = useModal('delete');

  const { mutate: deleteSlideById } = useDeleteData(
    deleteSlideAction,
    queryKey ?? ['goods']
  );

  const handleDelete = (id: string, title: string) => {
    setSlideToDelete({ id, title });
    deleteModal.open();
  };

  const handleDeleteConfirm = (title: string) => {
    if (!slideToDelete?.id) return;

    deleteSlideById(slideToDelete.id, {
      onSuccess: () => {
        toast.success(`Слайд: ${title} видалено`);
        deleteModal.close();
        if (refetch) refetch();
      },
    });
  };

  return {
    slideToDelete,
    handleDelete,
    handleDeleteConfirm,
    deleteModal,
  };
}
