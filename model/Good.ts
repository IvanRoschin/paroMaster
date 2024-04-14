import mongoose from 'mongoose'
const { Schema } = mongoose

const goodSchema = new Schema(
	{
		category: {
			type: 'string',
			enum: [
				'Корпус станції',
				'Корпус для прасок',
				'Підошви для прасок',
				'Плати керування',
				'Електроклапани',
				'Насоси(помпи)',
				'Резервуари для води',
				'Провода та шланги',
				'Аксесуари та комплектуючі',
			],
			required: true,
		},
		title: {
			type: 'string',
			required: true,
		},
		description: {
			type: 'string',
			required: true,
		},
		imgUrl: {
			type: ['string'],
			required: true,
		},
		brand: {
			type: 'string',
			required: true,
		},
		model: {
			type: 'string',
			required: true,
		},
		vendor: {
			type: 'string',
			required: true,
			unique: true,
		},
		price: {
			type: 'number',
			required: true,
		},
		isAvailable: {
			type: 'boolean',
			required: true,
		},
		isCompatible: {
			type: 'boolean',
			required: true,
		},
		compatibility: {
			type: ['string'],
		},
	},
	{ versionKey: false, timestamps: true },
)

goodSchema.index({ '$**': 'text' })

export default mongoose.models.Good || mongoose.model('Good', goodSchema)
