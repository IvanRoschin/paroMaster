import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema(
	{
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
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
		isActive: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ versionKey: false, timestamps: true },
)

userSchema.index({ '$**': 'text' })

export default mongoose.models.User || mongoose.model('User', userSchema)
