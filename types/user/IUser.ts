export interface IUser {
	createdAt: string | number | Date
	_id?: string
	name: string
	phone: string
	email: string
	password: string
	isAdmin: boolean
	isActive: boolean
}
