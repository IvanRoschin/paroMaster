import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type UpdateAction = (
  updatedDataItem: any
) => Promise<{ success: boolean; message: string; data?: { [key: string]: FormDataEntryValue } }>

export const useUpdateData = (action: UpdateAction, key: QueryKey) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updatedDataItem: any) => action(updatedDataItem),
    onSuccess: data => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: key })
      }
    },
    onError: () => {
      toast.error("Помилка при оновленні")
    }
  })
}
