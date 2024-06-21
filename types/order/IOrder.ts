export interface IOrder {
	_id?: string
	orderNumber: string
	customer: {
		name: string
		phone: string
		email: string
		address?: string
	}
	orderedGoods: {
		id: string
		title: string
		brand: string
		model: string
		vendor: string
		quantity: number
		price: number
	}[]
	totalPrice: number
	status: 'Новий' | 'Опрацьовується' | 'Оплачено' | 'На відправку' | 'Закритий'
}
