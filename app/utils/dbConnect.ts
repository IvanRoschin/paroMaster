import mongoose from 'mongoose'

let isConnected = false // track connection status

export const connectToDB = async () => {
	mongoose.set('strictQuery', true)

	const mongodbUri: string | undefined = process.env.MONGODB_URI

	const options = {
		// useNewUrlParser: true,
		// useUnifiedTopology: true,
		// serverSelectionTimeoutMS: 20000, // Increase server selection timeout to 20 seconds
		// connectTimeoutMS: 20000, // Increase connection timeout to 20 seconds
		dbName: 'paromaster', //
	}

	if (!mongodbUri) {
		throw new Error('MONGODB_URI is not defined')
	}

	if (isConnected) {
		console.log('MongoDB is already connected')
		return
	}

	try {
		await mongoose.connect(mongodbUri, options)
		isConnected = true
		console.log('MongoDB connected')
	} catch (error) {
		console.log(error || 'Can`t connect to MongoDB')
	}
}
