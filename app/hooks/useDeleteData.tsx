"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type DeleteAction = (id: string) => Promise<void>

export const useDeleteData = (action: DeleteAction, key: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      console.log(`Deleting item with id: ${id}`)
      return action(id)
    },
    onSuccess: () => {
      toast.success("Дані видалено!")
      console.log(`Refetching queries with key: ${key}`)
      queryClient.invalidateQueries({ queryKey: [key] })
    },
    onError: () => {
      toast.error("Помилка при видаленні")
    }
  })
}
