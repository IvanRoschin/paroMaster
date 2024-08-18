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
	limit: number,
	nextPage?: number,
): Promise<IGetAllGoodsResponse> {
	let skip

	if (nextPage) {
		skip = (nextPage - 1) * limit
	} else {
		const page = searchParams?.page || 1
		skip = (page - 1) * limit
	}

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
			.skip(skip)
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

		await Good.create({
			category: values.category,
			title: values.title,
			brand: values.brand,
			model: values.model,
			price: parseFloat(values.price as string),
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
		price?: any
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
			price: parseFloat(price),
			isAvailable: isAvailable === 'true',
			isCompatible: isCompatible === 'true',
			compatibility,
		}

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
