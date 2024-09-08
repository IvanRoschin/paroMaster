import Order from '@/models/Order'
import { connectToDB } from '@/utils/dbConnect'
import { NextResponse } from 'next/server'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
	const { id } = params
	if (!id) {
		return NextResponse.json({ message: 'Order ID not provided' }, { status: 400 })
	}

	try {
		await connectToDB()
		await Order.findByIdAndDelete(id)
		return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 })
	} catch (error) {
		return NextResponse.json({ message: 'Failed to delete the order', error }, { status: 500 })
	}
}
