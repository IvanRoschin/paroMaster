import mongoose from 'mongoose'
const { Schema } = mongoose

const testimonialsSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		stars: {
			type: Number,
			required: true,
		},
	},
	{ versionKey: false, timestamps: true },
)

testimonialsSchema.index({ '$**': 'text' })

export default mongoose.models.testimonialsSchema ||
	mongoose.model('Testimonials', testimonialsSchema)
