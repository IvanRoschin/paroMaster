import mongoose from 'mongoose'
const { Schema } = mongoose

const goodSchema = new Schema(
	{
		category: {
			type: String,
			enum: [
				'Бойлери',
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
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		src: {
			type: [String],
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
			unique: true,
		},
		price: {
			type: Number,
			required: true,
		},
		isAvailable: {
			type: Boolean,
			required: true,
		},
		isCompatible: {
			type: Boolean,
			required: true,
		},
		compatibility: {
			type: String,
		},
	},
	{ versionKey: false, timestamps: true },
)

goodSchema.index({ '$**': 'text' })

export default mongoose.models.Good || mongoose.model('Good', goodSchema)
