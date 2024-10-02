import { useMutation, useQueryClient } from '@tanstack/react-query'

type AddAction = (
	newData: FormData,
) => Promise<{ success: boolean; message: string; data?: { [key: string]: FormDataEntryValue } }>

export const useAddData = (action: AddAction, key: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (newDataItem: FormData) => action(newDataItem),
		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries({ queryKey: [key] })
		},
		onError: () => {
			console.error('Помилка при створенні')
		},
	})
}
