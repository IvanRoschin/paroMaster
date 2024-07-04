'use server'

import { IUser } from '@/types/user/IUser'
import { connectToDB } from '@/utils/dbConnect'
import User from 'model/User'
import { revalidatePath } from 'next/cache'

export async function addUser(values: IUser) {
	try {
		await connectToDB()
		console.log('values', values)

		const newUser = {
			name: values.name,
			phone: values.phone,
			email: values.email,
			password: values.password,
			isAdmin: values.isAdmin,
			isActive: values.isActive,
		}

		await User.create(newUser)
		revalidatePath('/')
		return { success: true, data: newUser }
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error adding newUser:', error)
			throw new Error('Failed to add newUser: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to add newUser: Unknown error')
		}
	}
}

export async function getAllUsers() {
	try {
		await connectToDB()

		const users: IUser[] = await User.find()

		return { success: true, data: users }
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error getting users:', error)
			throw new Error('Failed to get users: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to get users: Unknown error')
		}
	}
}
