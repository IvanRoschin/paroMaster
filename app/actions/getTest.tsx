'use server'

import { IItem } from '@/types/item/IItem'
import { connectToDB } from '@/utils/dbConnect'
import Good from 'model/Good'
import { revalidatePath } from 'next/cache'

type Search = {
	search?: string | null
}

export async function getAllGoods(props: Search) {
	const search = props.search || ''
	try {
		connectToDB()

		//$regex
		// const filter = { title: { $regex: search, $options: 'i' } }

		//$text
		const filter = {
			$text: {
				$search: search,
				$caseSensitive: false,
				$diacriticSensitive: false,
			},
		}
		const goods: IItem[] = await Good.find(filter).limit(10)
		if (goods.length === 0) {
			return null
		} else return goods
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
