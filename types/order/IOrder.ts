export interface IOrder {
	_id?: string
	number: string
	customer: {
		name: string
		surname?: string
		phone: string
		email: string
		city: string
		warehouse: string
		payment: string
	}
	warehouse?: string
	orderedGoods: {
		_id?: string
		category: string
		src: string[]
		brand: string
		model: string
		vendor: string
		title: string
		description: string
		price: number
		isAvailable: boolean
		isCompatible: boolean
		compatibility: string
		quantity?: number
	}[]
	totalPrice: number
	status: 'Новий' | 'Опрацьовується' | 'Оплачено' | 'На відправку' | 'Закритий'
}
