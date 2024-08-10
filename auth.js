// import User from '@/models/User'
// import { connectToDB } from '@/utils/dbConnect'
// import bcrypt from 'bcrypt'
// import NextAuth from 'next-auth'
// import Credentials from 'next-auth/providers/credentials'
// import { toast } from 'sonner'
// import { authConfig } from './auth.config'

// const login = async credentials => {
// 	try {
// 		await connectToDB()

// 		if (!credentials.email) {
// 			toast.error('Email must be provided')
// 			throw new Error('Email must be provided')
// 		}

// 		if (!credentials.password) {
// 			toast.error('Password must be provided')
// 			throw new Error('Password must be provided')
// 		}

// 		const user = await User.findOne({ email: credentials.email })

// 		if (!user) {
// 			toast.error('User not found')
// 			throw new Error('User not found')
// 		}

// 		if (!user.isAdmin) {
// 			toast.error("User doesn't have admin rights")
// 			throw new Error("User doesn't have admin rights")
// 		}

// 		const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

// 		if (!isPasswordCorrect) {
// 			toast.error('Wrong password')
// 			throw new Error('Wrong password')
// 		}

// 		return user
// 	} catch (error) {
// 		console.error(error.message)
// 		throw new Error(error.message || 'Failed to login')
// 	}
// }

// export const { auth, signIn, signOut } = NextAuth({
// 	...authConfig,
// 	providers: [
// 		Credentials({
// 			async authorize(credentials) {
// 				try {
// 					const user = await login(credentials)
// 					return user
// 				} catch (error) {
// 					toast.error(error.message)
// 					console.error('authorize error:', error)
// 					return null
// 				}
// 			},
// 		}),
// 	],
// 	callbacks: {
// 		async jwt({ token, user }) {
// 			if (user) {
// 				token.name = user.name
// 			}
// 			return token
// 		},
// 		async session({ session, token }) {
// 			if (token) {
// 				session.user.name = token.name
// 			}
// 			return session
// 		},
// 	},
// })
