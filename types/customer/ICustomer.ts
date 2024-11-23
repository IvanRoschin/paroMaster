import { IOrder } from '../order/IOrder'

export interface ICustomer {
	_id?: string
	name: string
	surname?: string
	phone: string
	email: string
	city: string
	warehouse: string
	payment: string
	orders?: IOrder
}
