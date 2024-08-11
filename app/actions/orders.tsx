'use server'

import Order from '@/models/Order'
import { IOrder } from '@/types/order/IOrder'
import { ISearchParams } from '@/types/searchParams'
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
	const status = searchParams.status === null ? 'all' : searchParams.status // Default status to 'all' if null

	console.log('searchParams', searchParams)
	console.log('status', status)

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

export async function deleteOrder(formData: FormData): Promise<void> {
	const { id } = Object.fromEntries(formData) as { id: string }
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

export async function updateOrder(values: IOrder) {
	const id = values._id

	const newOrderData = {
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
		status: values.status,
	}

	try {
		await connectToDB()

		const updatedOrder = await Order.findByIdAndUpdate(id, newOrderData, {
			new: true,
		}).lean()

		if (!updatedOrder || Array.isArray(updatedOrder)) {
			throw new Error('Failed to update order: No document returned or multiple documents returned')
		}
		return {
			success: true,
			data: updatedOrder,
		}
	} catch (error) {
		console.error('Error updating customer:', error)
		throw new Error(
			'Failed to update customer: ' + (error instanceof Error ? error.message : 'Unknown error'),
		)
	} finally {
		revalidatePath('/admin/orders')
		redirect('/admin/orders')
	}
}
