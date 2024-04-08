'use server'

import { IItem } from '@/types/item/IItem'
import { connectToDB } from '@/utils/dbConnect'
import Good from 'model/Good'
import { revalidatePath } from 'next/cache'

type Search = {
	search: string
	sort: string
}

//** Category search: { "category": {$eq:"cateroryName" } } * /
//** Vendor search: { "vendor": {$eq:"vendorName" } } * /

export async function getAllGoods(props?: Search) {
	try {
		connectToDB()

		let filter: any = {}
		if (props?.search) {
			// filter = { title: { $regex: props?.search } }
			// filter = {
			// 	$text: {
			// 		$search: props.search,
			// 		$caseSensitive: false,
			// 		$diacriticSensitive: false,
			// 	},
			// }

			filter = {
				$or: [
					{
						title: {
							$regex: props?.search,
							$options: 'i',
						},
					},
					{ vendor: props?.search },
					{
						brand: {
							$regex: props?.search,
							$options: 'i',
						},
					},
				],
			}
		}

		let sortOption: any = {}
		if (props?.sort === 'desc') {
			sortOption = { price: -1 }
		} else {
			sortOption = { price: 1 }
		}

		let goods: IItem[] = []

		goods = await Good.find(filter).sort(sortOption)

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
