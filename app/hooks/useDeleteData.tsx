"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type DeleteAction = (id: string) => Promise<void>

export const useDeleteData = (action: DeleteAction, key: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => action(id),
    onSuccess: () => {
      toast.success("Дані видалено!")
      // @ts-ignore
      queryClient.refetchQueries([key])
    },
    onError: () => {
      toast.error("Помилка при видаленні")
    }
  })
}
