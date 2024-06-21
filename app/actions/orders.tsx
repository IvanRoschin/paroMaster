'use server'

import { IOrder } from '@/types/order/IOrder'
import { connectToDB } from '@/utils/dbConnect'
import Order from 'model/Order'
import { revalidatePath } from 'next/cache'

export async function addOrder(values: IOrder) {
	try {
		await connectToDB()

		const orderData = {
			number: values.orderNumber, // Assuming 'number' corresponds to 'orderNumber' in your schema
			customer: values.customer,
			orderedGoods: values.orderedGoods.map(item => ({
				id: item.id, // Assuming 'id' exists in your ordered goods objects
				title: item.title, // Adjust properties as per your schema
				quantity: item.quantity, // Ensure 'quantity' is provided
				price: item.price, // Adjust as per your schema
			})),
			totalPrice: values.totalPrice,
			status: 'Новий', // Set initial status
		}

		console.log('orderData', orderData)
		await Order.create(orderData)
	} catch (error) {
		console.log(error)
	}
	revalidatePath('/')
}
