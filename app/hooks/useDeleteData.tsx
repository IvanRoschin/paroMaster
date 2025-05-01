"use client"

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type DeleteAction = (id: string) => Promise<void>

const useDeleteData = (action: DeleteAction, key: QueryKey) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => action(id),
    onSuccess: () => {
      toast.success("Дані видалено!")
      queryClient.invalidateQueries({ queryKey: [key] })
    },
    onError: () => {
      toast.error("Помилка при видаленні")
    }
  })
}

export default useDeleteData
