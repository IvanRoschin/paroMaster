export interface IOrder {
	_id?: string
	orderNumber: string
	customer: {
		name: string
		surname?: string
		phone: string
		email: string
		city: string
		warehouse: string
		payment: string
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
	goodsQuantity: number
	totalPrice: number
	status: 'Новий' | 'Опрацьовується' | 'Оплачено' | 'На відправку' | 'Закритий'
}
