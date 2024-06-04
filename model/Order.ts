import mongoose from 'mongoose'
const { Schema } = mongoose

const orderSchema = new Schema(
	{
		orderNumber: {
			type: String,
			required: true,
		},
		customer: {
			name: {
				type: String,
				required: true,
			},
			phone: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			address: {
				type: String,
			},
		},
		orderedGoods: [
			{
				id: {
					type: String,
					required: true,
				},
				title: {
					type: String,
					required: true,
				},
				brand: {
					type: String,
					required: true,
				},
				model: {
					type: String,
					required: true,
				},
				vendor: {
					type: String,
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
			},
		],
		totalPrice: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ['Новий', 'Опрацьовується', 'Оплачено', 'На відправку', 'Закритий'],
			required: true,
		},
	},
	{ versionKey: false, timestamps: true },
)

orderSchema.index({ '$**': 'text' })

export default mongoose.models.Order || mongoose.model('Order', orderSchema)
