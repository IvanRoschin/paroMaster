'use server'

import Testimonials from '@/models/Testimonials'
import { ISearchParams, ITestimonial } from '@/types/index'
import { connectToDB } from '@/utils/dbConnect'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface IGetAllTestimonials {
	success: boolean
	testimonials: ITestimonial[]
	count: number
}

export async function addTestimonial(formData: FormData) {
	const values = Object.fromEntries(formData.entries())
	try {
		await connectToDB()

		await Testimonials.create({
			name: values.name,
			text: values.text,
			rating: Number(values.rating),
			isActive: values.isActive === 'true',
		})
		return {
			success: true,
			message: 'Testimonial added successfully',
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error adding Testimonial:', error)
			throw new Error('Failed to add Testimonial: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to add Testimonial: Unknown error')
		}
	} finally {
		revalidatePath('/admin/testimonials')
	}
}

export async function getAllTestimonials(
	searchParams: ISearchParams,
	limit: number,
): Promise<IGetAllTestimonials> {
	const page = searchParams.page || 1

	try {
		await connectToDB()

		const count = await Testimonials.countDocuments()

		const testimonials: ITestimonial[] = await Testimonials.find()
			.skip(limit * (page - 1))
			.limit(limit)
			.exec()

		return {
			success: true,
			testimonials: JSON.parse(JSON.stringify(testimonials)),
			count: count,
		}
	} catch (error) {
		console.log(error)
		return { success: false, testimonials: [], count: 0 }
	}
}

export async function getTestimonialById(id: string) {
	try {
		await connectToDB()
		const category = await Testimonials.findById({ _id: id })
		return JSON.parse(JSON.stringify(category))
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error getting testimonials:', error)
			throw new Error('Failed to get testimonials: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to get testimonials: Unknown error')
		}
	}
}

export async function deleteTestimonial(formData: FormData) {
	const { id } = Object.fromEntries(formData) as { id: string }
	if (!id) {
		console.error('No ID provided')
		return
	}
	try {
		await connectToDB()
		await Testimonials.findByIdAndDelete(id)
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error delete category:', error)
			throw new Error('Failed to delete category: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to delete category: Unknown error')
		}
	} finally {
		revalidatePath('/admin/testimonials')
	}
}

export async function updateTestimonial(formData: FormData) {
	const entries = Object.fromEntries(formData.entries())
	const { id, name, text, rating, isActive } = entries as {
		id: string
		name?: string
		text?: string
		rating?: string
		isActive?: string
	}
	try {
		await connectToDB()
		const updateFields: Partial<ITestimonial> = {
			name: name || undefined,
			text: text || undefined,
			rating: rating ? Number(rating) : undefined,
			isActive: isActive === 'true',
		}
		Object.keys(updateFields).forEach(
			key =>
				(updateFields[key as keyof ITestimonial] === '' ||
					updateFields[key as keyof ITestimonial] === undefined) &&
				delete updateFields[key as keyof ITestimonial],
		)
		await Testimonials.findByIdAndUpdate(id, updateFields)
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error update testimonal:', error)
			throw new Error('Failed to testimonal user: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to update testimonal: Unknown error')
		}
	} finally {
		revalidatePath('/admin/testimonials')
		redirect('/admin/testimonials')
	}
}
