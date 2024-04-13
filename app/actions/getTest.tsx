'use server'

import { IItem } from '@/types/item/IItem'
import { ISearchParams } from '@/types/searchParams'
import { connectToDB } from '@/utils/dbConnect'
import Good from 'model/Good'
import { revalidatePath } from 'next/cache'

//** Vendor search: { "vendor": {$eq:"vendorName" } } * /

export async function getAllGoods({ searchParams }: { searchParams: ISearchParams }) {
	console.log(searchParams)
	try {
		connectToDB()

		let filter: any = {}

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

		if (searchParams?.category) {
			filter.category = searchParams.category
		}

		if (searchParams?.low && searchParams?.high) {
			filter.price = { $gte: Number(searchParams.low), $lte: Number(searchParams.high) }
		}

		let sortOption: any = {}
		if (searchParams?.sort === 'desc') {
			sortOption = { price: -1 }
		} else {
			sortOption = { price: 1 }
		}

		const goods: IItem[] = await Good.find(filter).sort(sortOption)

		return goods
	} catch (error) {
		console.log(error)
	}
	revalidatePath('/')
}

export async function getGoodById(id: string) {
	try {
		await connectToDB()

		const good = await Good.findById({ _id: id })
		return good
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
