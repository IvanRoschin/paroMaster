import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

type UpdateAction = (updatedDataItem: any) => Promise<{
  success: boolean;
  message: string;
  data?: { [key: string]: FormDataEntryValue };
}>;

const useUpdateData = (action: UpdateAction, key: QueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedDataItem: any) => action(updatedDataItem),
    onSuccess: async data => {
      if (data?.success) {
        await queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
    onError: () => {
      console.error('Помилка при оновленні');
    },
  });
};

export default useUpdateData;
