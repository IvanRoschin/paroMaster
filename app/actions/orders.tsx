'use server'

import { IOrder } from '@/types/order/IOrder'
import { connectToDB } from '@/utils/dbConnect'
import Order from 'model/Order'
import { revalidatePath } from 'next/cache'

export async function addOrder(values: IOrder) {
	try {
		await connectToDB()

		await Order.create({
			number: values.orderNumber,
			customer: values.customer,
			orderedGoods: values.orderedGoods,
			totalPrice: values.totalPrice,
			status: 'Новий', // Set initial status
		})
	} catch (error) {
		console.log(error)
	}
	revalidatePath('/')
}
