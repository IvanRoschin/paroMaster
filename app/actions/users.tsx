'use server'

import { ISearchParams } from '@/types/searchParams'
import { IUser } from '@/types/user/IUser'
import { connectToDB } from '@/utils/dbConnect'
import User from 'model/User'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addUser(values: IUser) {
	try {
		await connectToDB()
		// Check if email already exists
		const existingUser = await User.findOne({ email: values.email })
		if (existingUser) {
			throw new Error('Email already exists')
		}

		const newUser = new User({
			name: values.name,
			phone: values.phone,
			email: values.email,
			isAdmin: values.isAdmin,
			isActive: values.isActive,
		})

		newUser.setPassword(values.password)

		await newUser.save()
		revalidatePath('/admin/users')
		redirect('/admin/users')
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

export async function getAllUsers(searchParams: ISearchParams) {
	const q = searchParams.q || ''
	const page = searchParams.page || 1
	const ITEM_PER_PAGE = 2
	const regex = new RegExp(q, 'i')

	try {
		await connectToDB()
		const count = await User.find({ name: { $regex: regex } }).countDocuments()
		const users: IUser[] = await User.find({ name: { $regex: regex } })
			.limit(ITEM_PER_PAGE)
			.skip(ITEM_PER_PAGE * (page - 1))

		return { success: true, data: JSON.parse(JSON.stringify(users)), count: count }
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

export async function getUserById(id: string) {
	try {
		await connectToDB()
		const user = await User.findById({ _id: id })
		return JSON.parse(JSON.stringify(user))
	} catch (error) {
		console.log(error)
	}
}

export async function deleteUser(formData: any) {
	const { id } = Object.fromEntries(formData) as { id: string }
	if (!id) {
		console.error('No ID provided')
		return
	}
	try {
		await connectToDB()
		await User.findByIdAndDelete(id)
	} catch (error) {
		console.log(error)
	}
	revalidatePath('/admin/users')
}

export async function updateUser(formData: FormData) {
	const entries = Object.fromEntries(formData.entries())

	const { id, name, phone, email, password, isAdmin, isActive } = entries as {
		id: string
		name?: string
		phone?: string
		email?: string
		password?: string
		isAdmin?: string
		isActive?: string
	}
	try {
		await connectToDB()

		const updateFields: Partial<IUser> = {
			name,
			phone,
			email,
			password,
			isAdmin: isAdmin === 'true',
			isActive: isActive === 'true',
		}

		Object.keys(updateFields).forEach(
			key =>
				(updateFields[key as keyof IUser] === '' ||
					updateFields[key as keyof IUser] === undefined) &&
				delete updateFields[key as keyof IUser],
		)
		// Check if email already exists
		if (email) {
			const existingUser = await User.findOne({ email })
			if (existingUser && existingUser._id.toString() !== id) {
				throw new Error('Email already exists')
			}
		}
		await User.findByIdAndUpdate(id, updateFields)
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error update user:', error)
			throw new Error('Failed to update user: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to update user: Unknown error')
		}
	}
}
