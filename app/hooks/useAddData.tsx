import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"

type AddAction = (newData: any) => Promise<{ success: boolean; message: string }>

const useAddData = (actionFn: AddAction, key: QueryKey) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newDataItem: any) => actionFn(newDataItem),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [key] })
    },
    onError: () => {
      console.error("Помилка при створенні")
    }
  })
}

export default useAddData
