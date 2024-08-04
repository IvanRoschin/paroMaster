'use server'

import Customer from '@/models/Customer'
import { ICustomer } from '@/types/customer/ICustomer'
import { connectToDB } from '@/utils/dbConnect'
import { revalidatePath } from 'next/cache'

export async function addCustomer(values: ICustomer) {
	try {
		await connectToDB()

		const newCustomer = {
			name: values.name,
			phone: values.phone,
			email: values.email,
			city: values.city,
			warehouse: values.city,
			payment: values.payment,
			orders: [],
		}
		await Customer.create(newCustomer)
		revalidatePath('/')
		return { success: true, data: newCustomer }
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error adding customer:', error)
			throw new Error('Failed to add customer: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to add customer: Unknown error')
		}
	}
}
