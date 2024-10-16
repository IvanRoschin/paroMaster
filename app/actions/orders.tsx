'use server'

import Order from '@/models/Order'
import { SGood } from '@/types/good/IGood'
import { ISearchParams } from '@/types/index'
import { IOrder } from '@/types/order/IOrder'
import { connectToDB } from '@/utils/dbConnect'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface IGetAllOrdesResponse {
	success: boolean
	orders: IOrder[]
	count: number
}
export async function getAllOrders(
	searchParams: ISearchParams,
	limit: number,
): Promise<IGetAllOrdesResponse> {
	const page = searchParams.page || 1
	const status = searchParams.status === null ? 'all' : searchParams.status

	try {
		await connectToDB()

		let query = {}
		if (status !== 'all') {
			query = { status }
		}

		const count = await Order.countDocuments(query)

		const orders: IOrder[] = await Order.find(query)
			.skip(limit * (page - 1))
			.limit(limit)
			.exec()

		return { success: true, orders: JSON.parse(JSON.stringify(orders)), count }
	} catch (error) {
		console.log(error)
		return { success: false, orders: [], count: 0 }
	}
}

export async function addOrder(values: IOrder) {
	console.log('valuesBackend:', values)
	try {
		await connectToDB()

		const orderData = {
			number: values.number,
			customer: values.customer,
			orderedGoods: values.orderedGoods.map(item => ({
				id: item._id,
				title: item.title,
				brand: item.brand,
				model: item.model,
				vendor: item.vendor,
				price: item.price,
				quantity: item.quantity,
			})),
			totalPrice: values.totalPrice,
			status: values.status,
		}
		// console.log('orderData', orderData)

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

export const deleteGoodsFromOrder = async (orderId: string, goodsId: string) => {
	try {
		const order = await Order.findById(orderId)

		if (!order) {
			throw new Error('Order not found')
		}
		type OrderedGood = {
			id: string
			price: number
			quantity: number
		}

		const updatedGoods = order.orderedGoods.filter((good: OrderedGood) => good.id !== goodsId)

		order.orderedGoods = updatedGoods

		order.goodsQuantity = updatedGoods.reduce(
			(total: number, good: OrderedGood) => total + good.quantity,
			0,
		)
		order.totalPrice = updatedGoods.reduce(
			(total: number, good: OrderedGood) => total + good.price * good.quantity,
			0,
		)

		// Save the updated order
		await order.save()

		return { success: true, message: 'Goods deleted successfully' }
	} catch (error) {
		console.error('Error deleting goods:', error)
		return { success: false, message: 'Failed to delete goods' }
	}
}

export async function addOrderAction(formData: FormData) {
	const values: any = {}
	formData.forEach((value, key) => {
		if (!values[key]) {
			values[key] = []
		}
		values[key].push(value)
	})

	Object.keys(values).forEach(key => {
		if (values[key].length === 1) {
			values[key] = values[key][0]
		}
	})
	try {
		await connectToDB()

		const orderData = {
			number: values.number,
			customer: values.customer,
			orderedGoods: values.orderedGoods.map((item: SGood) => ({
				id: item._id,
				title: item.title,
				brand: item.brand,
				model: item.model,
				vendor: item.vendor,
				quantity: item.quantity,
				price: item.price,
			})),
			totalPrice: values.totalPrice,
			status: values.status || 'Новий',
		}
		await Order.create(orderData)
		revalidatePath('/')
		return { success: true, message: 'The New Order Successfully Added' }
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

export async function deleteOrder(id: string) {
	if (!id) {
		console.error('No ID provided')
		return
	}
	try {
		await connectToDB()
		await Order.findByIdAndDelete(id)
	} catch (error) {
		console.error('Failed to delete the order:', error)
	} finally {
		revalidatePath('/admin/orders')
		redirect('/admin/orders')
	}
}

export async function getOrderById(id: string) {
	try {
		await connectToDB()
		const order = await Order.findById({ _id: id })
		return JSON.parse(JSON.stringify(order))
	} catch (error) {
		console.log(error)
	}
}

export async function updateOrder(formData: Record<string, any>) {
	const values: any = {}

	// Loop through the object instead of using forEach
	Object.keys(formData).forEach(key => {
		if (!values[key]) {
			values[key] = []
		}
		values[key].push(formData[key])
	})

	Object.keys(values).forEach(key => {
		if (values[key].length === 1) {
			values[key] = values[key][0]
		}
	})

	const { id, number, customer, orderedGoods, goodsQuantity, totalPrice, status } = values as {
		id: string
		number?: string
		customer?: any
		orderedGoods?: any
		goodsQuantity?: number
		totalPrice?: number
		status?: 'Новий' | 'Опрацьовується' | 'Оплачено' | 'На відправку' | 'Закритий'
	}

	try {
		await connectToDB()

		const updateFields: Partial<IOrder> = {
			number,
			customer,
			orderedGoods,
			// goodsQuantity,
			totalPrice,
			status,
		}

		Object.keys(updateFields).forEach(
			key =>
				(updateFields[key as keyof IOrder] === '' ||
					updateFields[key as keyof IOrder] === undefined) &&
				delete updateFields[key as keyof IOrder],
		)
		console.log('id', id)
		console.log('updateFields', updateFields)

		await Order.findByIdAndUpdate(id, updateFields)
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error updating good:', error)
			throw new Error('Failed to update good: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to update good: Unknown error')
		}
	} finally {
		revalidatePath('/admin/orders')
		redirect('/admin/orders')
	}
}

// const newOrderData = {
// 	orderNumber: values.orderNumber,
// 	customer: values.customer,
// 	orderedGoods: values.orderedGoods.map(item => ({
// 		id: item.id,
// 		title: item.title,
// 		brand: item.brand,
// 		model: item.model,
// 		vendor: item.vendor,
// 		quantity: item.quantity,
// 		price: item.price,
// 	})),
// 	totalPrice: values.totalPrice,
// 	status: values.status,
// }

// try {
// 	await connectToDB()

// const updatedOrder = await Order.findByIdAndUpdate(id, newOrderData, {
// 	new: true,
// }).lean()

// 		if (!updatedOrder || Array.isArray(updatedOrder)) {
// 			throw new Error('Failed to update order: No document returned or multiple documents returned')
// 		}
// 		return {
// 			success: true,
// 			data: updatedOrder,
// 		}
// 	} catch (error) {
// 		console.error('Error updating customer:', error)
// 		throw new Error(
// 			'Failed to update customer: ' + (error instanceof Error ? error.message : 'Unknown error'),
// 		)
// 	} finally {
// 		revalidatePath('/admin/orders')
// 		redirect('/admin/orders')
// 	}
// }
