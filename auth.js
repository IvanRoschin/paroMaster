import { connectToDB } from '@/utils/dbConnect'
import User from 'model/User'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'

const login = async credentials => {
	try {
		await connectToDB()
		const user = await User.findOne({ email: credentials.username })
		if (!user) throw new Error(error.message || 'Wrong credentials')

		const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

		if (!isPasswordCorrect) throw new Error(error.message || 'Wrong password')

		return user
	} catch (error) {
		console.log(error.message)
		throw new Error(error.message || 'Failed to login')
	}
}

export const { auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			name: 'Credentials',
			async authorize(credentials) {
				try {
					const user = await login(credentials)
					return user
				} catch (error) {
					console.log(error.message)
					return null
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.name = user.name
			}
			return token
		},
	},
	async session({ session, token }) {
		if (token) {
			session.user.name = token.name
		}
		return session
	},
})
