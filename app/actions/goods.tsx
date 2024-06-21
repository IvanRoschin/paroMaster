'use server'

import { IItem } from '@/types/item/IItem'
import { ISearchParams } from '@/types/searchParams'
import { connectToDB } from '@/utils/dbConnect'
import Good from 'model/Good'
import { revalidatePath } from 'next/cache'

//** Vendor search: { "vendor": {$eq:"vendorName" } } * /

export async function getAllGoods(
	searchParams: ISearchParams,
	offset: number,
	limit: number,
): Promise<IItem[]> {
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

		const goods: IItem[] = await Good.find(filter)
			.sort(sortOption)
			.skip(offset)
			.limit(limit)
			.exec()

		return JSON.parse(JSON.stringify(goods))
	} catch (error) {
		console.log(error)
		return []
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

export async function addGood(values: IItem) {
	try {
		await connectToDB()

		await Good.create({
			category: values.category,
			title: values.title,
			brand: values.brand,
			model: values.model,
			price: values.price,
			description: values.description,
			imgUrl: values.imgUrl,
			vendor: values.vendor,
			isAvailable: values.isAvailable,
			isCompatible: values.isCompatible,
			compatibility: values.compatibility,
		})
	} catch (error) {
		console.log(error)
	}
	revalidatePath('/')
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
