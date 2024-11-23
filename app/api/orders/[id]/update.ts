import Order from '@/models/Order'
import { connectToDB } from '@/utils/dbConnect'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
	const { id } = params
	if (!id) {
		return NextResponse.json({ message: 'Order ID not provided' }, { status: 400 })
	}

	try {
		await connectToDB()

		const body = await req.json()

		// Validate if the body contains the necessary fields to update
		if (!body) {
			return NextResponse.json({ message: 'No data provided for update' }, { status: 400 })
		}

		// Find the order by ID and update it
		const updatedOrder = await Order.findByIdAndUpdate(id, body, {
			new: true, // Return the updated document
			runValidators: true, // Ensure the update respects schema validations
		})

		if (!updatedOrder) {
			return NextResponse.json({ message: 'Order not found' }, { status: 404 })
		}

		return NextResponse.json(
			{ message: 'Order updated successfully', order: updatedOrder },
			{ status: 200 },
		)
	} catch (error) {
		return NextResponse.json({ message: 'Failed to update the order', error }, { status: 500 })
	}
}
