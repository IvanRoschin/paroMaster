"use client"

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type DeleteAction = (id: string) => Promise<void>

export const useDeleteData = (actionFn: DeleteAction, key: QueryKey) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => actionFn(id),
    onSuccess: (_, id) => {
      toast.success(`Дані ${id} видалено!`)
      queryClient.invalidateQueries({ queryKey: [key] })
    },
    onError: () => {
      toast.error("Помилка при видаленні")
    }
  })
}
