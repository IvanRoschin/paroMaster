import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"

type AddAction = (newData: any) => Promise<{ success: boolean; message: string }>

export const useAddTestimonial = (actionFn: AddAction, key: QueryKey, productId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newDataItem: any) => actionFn(newDataItem),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [key, productId] })
    },
    onError: () => {
      console.error("Помилка при створенні")
    }
  })
}
