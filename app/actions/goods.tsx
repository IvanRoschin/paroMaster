'use server'

import Good from '@/models/Good'
import { IGood } from '@/types/good/IGood'
import { ISearchParams } from '@/types/searchParams'
import { connectToDB } from '@/utils/dbConnect'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface IGetAllGoodsResponse {
	success: boolean
	goods: IGood[]
	count: number
}

export async function getAllGoods(
	searchParams: ISearchParams,
	offset: number,
	limit: number,
): Promise<IGetAllGoodsResponse> {
	const page = searchParams.page || 1

	try {
		await connectToDB()

		let filter: any = {}

		// search string filter
		if (searchParams?.search) {
			filter.$and = [
				// Wrap conditions in $and operator
				{
					$or: [
						{ title: { $regex: searchParams.search, $options: 'i' } },
						{ vendor: searchParams.search },
						{ brand: { $regex: searchParams.search, $options: 'i' } },
						{ compatibility: { $regex: searchParams.search, $options: 'i' } },
					],
				},
			]
		}

		// brand filter
		if (searchParams?.brand) {
			filter.brand = searchParams.brand
		}

		// category filter
		if (searchParams?.category) {
			filter.category = searchParams.category
		}

		// price filter
		if (searchParams?.low && searchParams?.high) {
			filter.price = { $gte: Number(searchParams.low), $lte: Number(searchParams.high) }
		}

		// sort by price
		let sortOption: any = {}
		if (searchParams?.sort === 'desc') {
			sortOption = { price: -1 }
		} else {
			sortOption = { price: 1 }
		}
		const count = await Good.countDocuments(filter)

		const goods: IGood[] = await Good.find(filter)
			.sort(sortOption)
			.skip(offset)
			.limit(limit)
			.exec()

		return { success: true, goods: JSON.parse(JSON.stringify(goods)), count: count }
	} catch (error) {
		console.log(error)
		return { success: false, goods: [], count: 0 }
	}
}

export async function getGoodById(id: string) {
	try {
		await connectToDB()
		const good = await Good.findById({ _id: id })
		return JSON.parse(JSON.stringify(good))
	} catch (error) {
		console.log(error)
	}
}

export async function addGood(formData: FormData) {
	const values = Object.fromEntries(formData.entries())
	try {
		await connectToDB()

		await Good.create({
			category: values.category,
			title: values.title,
			brand: values.brand,
			model: values.model,
			price: parseFloat(values.price as string),
			description: values.description,
			imgUrl: values.imgUrl instanceof Array ? values.imgUrl : [values.imgUrl],
			vendor: values.vendor,
			isAvailable: values.isAvailable === 'true',
			isCompatible: values.isCompatible === 'false',
			compatibility:
				values.compatibility instanceof Array ? values.compatibility : [values.compatibility],
		})
	} catch (error) {
		console.log(error)
	}
	revalidatePath('/admin/goods')
	redirect('/admin/goods')
}

export async function deleteGood(formData: FormData): Promise<void> {
	const { id } = Object.fromEntries(formData) as { id: string }
	if (!id) {
		console.error('No ID provided')
		return
	}
	try {
		await connectToDB()
		await Good.findByIdAndDelete(id)
		revalidatePath('/admin/goods')
	} catch (error) {
		console.error('Failed to delete the good:', error)
	}
}

export async function uniqueBrands() {
	try {
		connectToDB()
		const uniqueBrands = await Good.distinct('brand')
		return uniqueBrands
	} catch (error) {
		console.log(error)
	}
	revalidatePath('/')
}

export async function getMinMaxPrice() {
	try {
		connectToDB()

		const result = await Good.aggregate([
			{
				$group: {
					_id: null,
					minPrice: { $min: '$price' },
					maxPrice: { $max: '$price' },
				},
			},
			{
				$project: {
					_id: 0,
					minPrice: 1,
					maxPrice: 1,
				},
			},
		]).exec()

		if (result.length === 0) {
			throw new Error('No goods found')
		}

		return result[0]
	} catch (error) {
		console.error(error)
	}
	revalidatePath('/')
}

export async function updateGood(formData: FormData) {
	const entries = Object.fromEntries(formData.entries())

	const {
		id,
		category,
		imgUrl,
		brand,
		model,
		vendor,
		title,
		description,
		price,
		isAvailable,
		isCompatible,
		compatibility,
	} = entries as {
		id: string
		category?: string
		imgUrl?: any
		brand?: string
		model?: string
		vendor?: string
		title?: string
		description?: string
		price?: any
		isAvailable?: string
		isCompatible?: string
		compatibility?: any
	}

	try {
		await connectToDB()

		const updateFields: Partial<IGood> = {
			category,
			imgUrl,
			brand,
			model,
			vendor,
			title,
			description,
			price: parseFloat(price),
			isAvailable: isAvailable === 'true',
			isCompatible: isCompatible === 'true',
			compatibility: Array.isArray(compatibility) ? compatibility : [compatibility],
		}

		Object.keys(updateFields).forEach(
			key =>
				(updateFields[key as keyof IGood] === '' ||
					updateFields[key as keyof IGood] === undefined) &&
				delete updateFields[key as keyof IGood],
		)
		await Good.findByIdAndUpdate(id, updateFields)
		return { success: true }
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error updating good:', error)
			throw new Error('Failed to update good: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to update good: Unknown error')
		}
	}
}
