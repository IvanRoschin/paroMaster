import User from '@/models/User'
import { connectToDB } from '@/utils/dbConnect'
import bcrypt from 'bcrypt'
import { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { toast } from 'sonner'

export const authOptions: NextAuthOptions = {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		Credentials({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email', required: true },
				password: { label: 'Password', type: 'password', required: true },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					throw new Error('Invalid credentials')
				}

				await connectToDB()

				const user = await User.findOne({ email: credentials.email })

				if (!user) {
					toast.error('User not found')
					throw new Error('User not found')
				}

				if (!user.isAdmin) {
					toast.error("User doesn't have admin rights")
					throw new Error("User doesn't have admin rights")
				}

				// Ensure both are strings
				if (typeof credentials.password !== 'string' || typeof user.password !== 'string') {
					throw new Error('Invalid password format')
				}

				// Perform password comparison
				const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

				if (!isPasswordCorrect) {
					toast.error('Wrong password')
					throw new Error('Wrong password')
				}

				return user
			},
		}),
	],

	pages: { signIn: '/login' },

	debug: process.env.NODE_ENV === 'development',
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
}
