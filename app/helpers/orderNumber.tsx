// Import necessary libraries or modules as needed

// Function to generate a random alphanumeric string of given length
// function generateRandomString(length: number): string {
// 	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
// 	let result = ''
// 	for (let i = 0; i < length; i++) {
// 		result += chars.charAt(Math.floor(Math.random() * chars.length))
// 	}
// 	return result
// }

// Function to generate an order number
export function generateOrderNumber(): string {
	const prefix = 'ORD' // Example prefix for order number
	const timestamp = Date.now().toString() // Get current timestamp
	// const randomPart = generateRandomString(4) // Generate a random string part
	const orderNumber = `${prefix}-${timestamp}` // Example format: ORD-1624201696065-ABCD
	return orderNumber
}
