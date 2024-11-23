import { useMutation, useQueryClient } from '@tanstack/react-query'

type AddAction = (newData: any) => Promise<{ success: boolean; message: string }>

export const useAddData = (action: AddAction, key: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (newDataItem: any) => action(newDataItem),
		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries({ queryKey: [key] })
		},
		onError: () => {
			console.error('Помилка при створенні')
		},
	})
}
