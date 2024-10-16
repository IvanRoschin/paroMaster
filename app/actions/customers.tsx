'use server'

import Customer from '@/models/Customer'
import { ICustomer } from '@/types/customer/ICustomer'
import { ISearchParams } from '@/types/index'
import { connectToDB } from '@/utils/dbConnect'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface IGetAllCostomers {
	success: boolean
	customers: ICustomer[]
	count: number
}

export async function getAllCustomers(
	searchParams: ISearchParams,
	limit: number,
): Promise<IGetAllCostomers> {
	const page = searchParams.page || 1

	try {
		await connectToDB()

		const count = await Customer.countDocuments()

		const customers: ICustomer[] = await Customer.find()
			.skip(limit * (page - 1))
			.limit(limit)
			.exec()

		return { success: true, customers: JSON.parse(JSON.stringify(customers)), count: count }
	} catch (error) {
		console.log(error)
		return { success: false, customers: [], count: 0 }
	}
}

export async function addCustomer(values: ICustomer) {
	try {
		await connectToDB()

		const phone = values?.phone
		const existingCustomer = await Customer.findOne({ phone })
		if (existingCustomer) {
			return {
				success: true,
				message: 'Phone already exist',
			}
		}

		const newCustomer = {
			name: values.name,
			phone: values.phone,
			email: values.email,
			city: values.city,
			warehouse: values.warehouse,
			payment: values.payment,
		}

		await Customer.create(newCustomer)
		return {
			success: true,
			data: newCustomer,
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error adding customer:', error)
			throw new Error('Failed to add customer: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to add customer: Unknown error')
		}
	} finally {
		revalidatePath('/admin/customers')
	}
}

export async function deleteCustomer(id: string) {
	if (!id) {
		console.error('No ID provided')
		return
	}
	try {
		await connectToDB()
		await Customer.findByIdAndDelete(id)
	} catch (error) {
		console.error('Failed to delete the good:', error)
	} finally {
		revalidatePath('/admin/customers')
		redirect('/admin/customers')
	}
}

export async function getCustomerById(id: string) {
	try {
		await connectToDB()
		const customer = await Customer.findById({ _id: id })
		return JSON.parse(JSON.stringify(customer))
	} catch (error) {
		console.log(error)
	}
}

export async function updateCustomer(
	formData: FormData,
): Promise<{
	success: boolean
	data: {
		name: FormDataEntryValue
		phone: FormDataEntryValue
		email: FormDataEntryValue
		city: FormDataEntryValue
		warehouse: FormDataEntryValue
		payment: FormDataEntryValue
	}
}> {
	const entries = Object.fromEntries(formData.entries())

	const { id, name, phone, email, city, warehouse, payment } = entries as {
		id: string
		name?: string
		phone?: string
		email?: string
		city?: string
		warehouse?: string
		payment?: string
	}

	try {
		await connectToDB()

		const updateFields: Partial<ICustomer> = {
			name,
			phone,
			email,
			city,
			warehouse,
			payment,
		}

		Object.keys(updateFields).forEach(
			key =>
				(updateFields[key as keyof ICustomer] === '' ||
					updateFields[key as keyof ICustomer] === undefined) &&
				delete updateFields[key as keyof ICustomer],
		)

		const updatedCustomer = await Customer.findByIdAndUpdate(id, updateFields, { new: true }).lean()

		if (!updatedCustomer || Array.isArray(updatedCustomer)) {
			throw new Error(
				'Failed to update customer: No document returned or multiple documents returned',
			)
		}

		return {
			success: true,
			data: {
				name: updatedCustomer.name as FormDataEntryValue,
				phone: updatedCustomer.phone as FormDataEntryValue,
				email: updatedCustomer.email as FormDataEntryValue,
				city: updatedCustomer.city as FormDataEntryValue,
				warehouse: updatedCustomer.warehouse as FormDataEntryValue,
				payment: updatedCustomer.payment as FormDataEntryValue,
			},
		}
	} catch (error) {
		console.error('Error updating customer:', error)
		throw new Error(
			'Failed to update customer: ' + (error instanceof Error ? error.message : 'Unknown error'),
		)
	} finally {
		revalidatePath('/admin/customers')
		redirect('/admin/customers')
	}
}
