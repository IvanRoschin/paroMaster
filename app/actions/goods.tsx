'use server'

import Good from '@/models/Good'
import { IGood } from '@/types/good/IGood'
import { ISearchParams } from '@/types/index'
import { connectToDB } from '@/utils/dbConnect'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface IGetAllGoods {
	success: boolean
	goods: IGood[]
	count: number
}

export interface IGetAllBrands {
	success: boolean
	brands: string[]
}

export async function getAllGoods(
	searchParams: ISearchParams,
	limit: number,
	nextPage?: number,
): Promise<IGetAllGoods> {
	console.log('searchParams', searchParams)

	let skip: number

	if (nextPage) {
		skip = (nextPage - 1) * limit
	} else {
		const page = searchParams?.page || 1
		skip = (page - 1) * limit
	}

	try {
		await connectToDB()

		// Initialize the filter object
		let filter: any = {}

		// Handle search filter
		if (searchParams?.search) {
			filter.$and = [
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

		// Handle brand filter
		if (searchParams?.brand) {
			filter.brand = searchParams.brand
		}

		// Handle category filter
		let categoryFilter: any = {}
		if (searchParams?.category) {
			categoryFilter = { category: searchParams.category }
		}

		// Handle price filter with aggregation
		let priceFilter: any = {}
		if (searchParams?.low && searchParams?.high) {
			const lowPrice = Number(searchParams.low)
			const highPrice = Number(searchParams.high)

			if (!isNaN(lowPrice) && !isNaN(highPrice)) {
				priceFilter = {
					$expr: {
						$and: [
							{ $gte: [{ $toDouble: '$price' }, lowPrice] },
							{ $lte: [{ $toDouble: '$price' }, highPrice] },
						],
					},
				}
			}
		}

		// Combine category and price filters
		filter = {
			$and: [categoryFilter, priceFilter, ...(filter.$and || [])],
		}

		// Handle sort by price
		let sortOption: any = {}
		if (searchParams?.sort === 'desc') {
			sortOption = { price: -1 }
		} else {
			sortOption = { price: 1 }
		}

		// Query the count of documents matching the filter
		const count = await Good.countDocuments(filter)
		console.log('filter', filter)

		// Query the actual documents with pagination
		const goods: IGood[] = await Good.find(filter)
			.sort(sortOption)
			.skip(skip)
			.limit(limit)
			.exec()

		return {
			success: true,
			goods: JSON.parse(JSON.stringify(goods)),
			count: count,
		}
	} catch (error) {
		console.log('Error fetching goods:', error)
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
	// const values = Object.fromEntries( formData.entries() )
	const values: any = {}

	formData.forEach((value, key) => {
		if (!values[key]) {
			values[key] = []
		}
		values[key].push(value)
	})

	Object.keys(values).forEach(key => {
		if (values[key].length === 1) {
			values[key] = values[key][0]
		}
	})
	const price = Number(values.price)
	if (isNaN(price)) {
		console.error('Price must be a valid number')
		return
	}
	values.price = price
	if (
		!values.category ||
		!values.title ||
		!values.brand ||
		!values.model ||
		!values.model ||
		!values.price ||
		!values.description ||
		!values.src
	) {
		console.error('Missing required fields')
		return
	}

	try {
		await connectToDB()

		console.log('Price before saving:', typeof values.price, values.price)

		await Good.create({
			category: values.category,
			title: values.title,
			brand: values.brand.charAt(0).toUpperCase() + values.brand.slice(1).toLowerCase(),
			model: values.model,
			price: Number(values.price),
			description: values.description,
			src: values.src instanceof Array ? values.src : [values.src],
			vendor: values.vendor,
			isAvailable: values.isAvailable === 'true',
			isCompatible: values.isCompatible === 'false',
			compatibility:
				values.compatibility instanceof Array ? values.compatibility : [values.compatibility],
		})
		return {
			success: true,
			message: 'Good added successfully',
		}
	} catch (error) {
		console.log(error)
	} finally {
		revalidatePath('/admin/goods')
		redirect('/admin/goods')
	}
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
	} catch (error) {
		console.error('Failed to delete the good:', error)
	} finally {
		revalidatePath('/admin/goods')
		redirect('/admin/goods')
	}
}

export async function updateGood(formData: FormData) {
	// const entries = Object.fromEntries(formData.entries())
	const values: any = {}
	formData.forEach((value, key) => {
		if (!values[key]) {
			values[key] = []
		}
		values[key].push(value)
	})

	Object.keys(values).forEach(key => {
		if (values[key].length === 1) {
			values[key] = values[key][0]
		}
	})
	const {
		id,
		category,
		src,
		brand,
		model,
		vendor,
		title,
		description,
		price,
		isAvailable,
		isCompatible,
		compatibility,
	} = values as {
		id: string
		category?: string
		src?: any
		brand?: string
		model?: string
		vendor?: string
		title?: string
		description?: string
		price?: number
		isAvailable?: string
		isCompatible?: string
		compatibility?: any
	}

	try {
		await connectToDB()

		const updateFields: Partial<IGood> = {
			category,
			src,
			brand,
			model,
			vendor,
			title,
			description,
			price: Number(price),
			isAvailable: isAvailable === 'true',
			isCompatible: isCompatible === 'true',
			compatibility,
		}

		// const price = Number(values.price)
		// if (isNaN(price)) {
		// 	console.error('Price must be a valid number')
		// 	return
		// }

		Object.keys(updateFields).forEach(
			key =>
				(updateFields[key as keyof IGood] === '' ||
					updateFields[key as keyof IGood] === undefined) &&
				delete updateFields[key as keyof IGood],
		)
		await Good.findByIdAndUpdate(id, updateFields)
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error updating good:', error)
			throw new Error('Failed to update good: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Failed to update good: Unknown error')
		}
	} finally {
		revalidatePath('/admin/goods')
		redirect('/admin/goods')
	}
}

export async function uniqueBrands(): Promise<IGetAllBrands> {
	try {
		connectToDB()
		const uniqueBrands = await Good.distinct('brand')
		return {
			success: true,
			brands: uniqueBrands,
		}
	} catch (error) {
		console.log(error)
		return { success: false, brands: [] }
	} finally {
		revalidatePath('/')
	}
}

export async function getMinMaxPrice() {
	try {
		// Connect to the database
		await connectToDB()

		// Perform the aggregation
		const result = await Good.aggregate([
			{
				$project: {
					// Convert price to double, exclude documents where price is not a number
					price: {
						$cond: {
							if: { $isNumber: { $toDouble: '$price' } },
							then: { $toDouble: '$price' },
							else: null,
						},
					},
				},
			},
			{
				$match: {
					// Filter out documents where price is null (i.e., was not a number)
					price: { $ne: null },
				},
			},
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

		// Handle the case where no goods are found
		if (result.length === 0) {
			throw new Error('No valid goods found')
		}

		return {
			success: true,
			minPrice: result[0].minPrice,
			maxPrice: result[0].maxPrice,
		}
	} catch (error) {
		console.error('Error fetching min and max prices:', error)
	}
}
