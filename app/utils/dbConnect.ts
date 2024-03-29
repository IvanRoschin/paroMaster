import mongoose from 'mongoose'

let isConnected = false // track connection status

export const connectToDB = async () => {
	mongoose.set('strictQuery', true)

	const mongodbUri: string | undefined = process.env.MONGODB_URI

	if (!mongodbUri) {
		throw new Error('MONGODB_URI is not defined')
	}

	if (isConnected) {
		console.log('MongoDB is already connected')
		return
	}

	try {
		await mongoose.connect(mongodbUri, {
			dbName: 'paromaster',
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
		})
		isConnected = true
		console.log('MongoDB connected')
	} catch (error) {
		console.log(error || 'Can`t connect to MongoDB')
	}
}
