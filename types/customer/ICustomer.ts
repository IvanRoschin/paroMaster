import { IOrder } from '../order/IOrder'

export interface ICustomer {
	name: string
	phone: string
	email: string
	city: string
	warehouse: string
	payment: string
	orders: IOrder[]
}
