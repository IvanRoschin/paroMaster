import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type UpdateAction = (
	updatedDataItem: FormData,
) => Promise<{ success: boolean; message: string; data?: { [key: string]: FormDataEntryValue } }>

export const useUpdateData = (action: UpdateAction, key: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (updatedDataItem: FormData) => action(updatedDataItem),
		onSuccess: () => {
			// toast.success(`${key} оновлено!`)
			// @ts-ignore
			queryClient.invalidateQueries([key])
		},
		onError: () => {
			toast.error('Помилка при оновленні')
		},
	})
}
