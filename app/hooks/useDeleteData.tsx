"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type DeleteAction = (id: string) => Promise<void>

export const useDeleteData = (action: DeleteAction, key: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      console.log(`Deleting item with id: ${id}`)
      return action(id)
    },
    onSuccess: (_, variables) => {
      const id = variables
      toast.success("Дані видалено!")
      console.log(`Refetching queries with key: ${key}, id: ${id}`)

      // Принудительное обновление данных
      queryClient.invalidateQueries({ queryKey: [key] })
      queryClient.refetchQueries({ queryKey: [key] }) // Дополнительный шаг, чтобы принудительно перезагрузить данные
    },
    onError: () => {
      toast.error("Помилка при видаленні")
    }
  })
}
