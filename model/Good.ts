import mongoose from 'mongoose'

const { Schema } = mongoose

const goodSchema = new Schema(
	{
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
