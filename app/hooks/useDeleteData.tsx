'use client';

import { toast } from 'sonner';

import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

type DeleteAction = (id: string) => Promise<void>;

const useDeleteData = (action: DeleteAction, key: QueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => action(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
    onError: () => {
      toast.error('Помилка при видаленні');
    },
  });
};

export default useDeleteData;
