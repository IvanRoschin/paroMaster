import mongoose from 'mongoose'

const { Schema } = mongoose

const sliderSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			required: true,
		},
		src: {
			type: String,
			required: true,
		},
	},

	{ versionKey: false, timestamps: true },
)

sliderSchema.index({ '$**': 'text' })

export default mongoose.models.Slider || mongoose.model('Slider', sliderSchema)
