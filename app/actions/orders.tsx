'use server'

import { IOrder } from '@/types/order/IOrder'
import { connectToDB } from '@/utils/dbConnect'
import Order from 'model/Order'
import { revalidatePath } from 'next/cache'

export async function addOrder(values: IOrder) {
	try {
		await connectToDB()

		const orderData = {
			orderNumber: values.orderNumber,
			customer: values.customer,
			orderedGoods: values.orderedGoods.map(item => ({
				id: item.id,
				title: item.title,
				brand: item.brand,
				model: item.model,
				vendor: item.vendor,
				quantity: item.quantity,
				price: item.price,
			})),
			totalPrice: values.totalPrice,
			status: 'Новий',
		}
		console.log('orderActionData: ', orderData)
		await Order.create(orderData)
		revalidatePath('/')
		return { success: true, data: orderData }
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error adding order:', error)
			throw new Error('Failed to add order: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to add order: Unknown error')
		}
	}
}

export async function getAllOrders() {
	try {
		await connectToDB()
		const orders: IOrder[] = await Order.find()
		return { success: true, data: orders }
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error getting orders:', error)
			throw new Error('Failed to get orders: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to get orders: Unknown error')
		}
	}
}
