'use server'

import { IItem } from '@/types/item/IItem'
import { connectToDB } from '@/utils/dbConnect'
import Good from 'model/Good'
import { revalidatePath } from 'next/cache'

type Search = {
	search?: string | null
	sort?: string | null
}

export async function getAllGoods(props?: Search) {
	const search = props?.search || ''
	const sort = props?.sort || 'createdAt'
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
		let goods = []
		console.log('search:', search)
		console.log('sort:', sort)

		if (search === '' || sort === '') {
			goods = await Good.find()
		} else {
			goods = await Good.find(filter).sort(sort)
		}
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
