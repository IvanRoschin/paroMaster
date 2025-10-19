import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

type AddAction<T = any> = (newData: any) => Promise<T>;

const useAddData = <T,>(actionFn: AddAction<T>, key: QueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newDataItem: any) => actionFn(newDataItem),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [key] });
    },
    onError: error => {
      console.error('Помилка при створенні', error);
    },
  });
};

export default useAddData;
