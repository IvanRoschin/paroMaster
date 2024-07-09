import { signIn } from 'next-auth/react'

type Props = {}

const authentificate = async (formData: FormData) => {
	const { email, password } = Object.fromEntries(formData)
	try {
		await signIn('credentials', { email, password })
	} catch (error) {
		console.error(error)
		return { error: 'Invalid credentials' }
	}
}

export default authentificate
