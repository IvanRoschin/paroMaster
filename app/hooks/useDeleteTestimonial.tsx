"use client"

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type DeleteAction = (id: string) => Promise<void>

export const useDeleteTestimonial = (actionFn: DeleteAction, key: QueryKey, productId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => actionFn(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: [key, productId] })
    },
    onError: () => {
      toast.error("Помилка при видаленні")
    }
  })
}
