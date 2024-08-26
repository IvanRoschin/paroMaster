///Categories///
// 'use client'

// import { getAllCategories } from '@/actions/categories'
// import { ICategory } from '@/types/index'
// import useSWR from 'swr'

// interface CategoriesResponse {
// 	success: boolean
// 	categories: ICategory[]
// 	count: number
// }

// const fetcher = async (): Promise<CategoriesResponse> => {
// 	return getAllCategories()
// }
// const { data, error } = useSWR(['categories'], () => fetcher())

export const categoryList = [
	{
		icon: 'category_korpusniDetali',
		title: 'Корпус станції',
	},
	{
		icon: 'category_korpusUtuga',
		title: 'Корпус для прасок',
	},
	{
		icon: 'category_pidoshvaUtuga',
		title: 'Підошви для прасок',
	},
	{
		icon: 'category_platu',
		title: 'Плати керування',
	},
	{
		icon: 'category_boiler',
		title: 'Бойлери',
	},
	{
		icon: 'category_electroKlapan',
		title: 'Електроклапани',
	},
	{
		icon: 'category_nasos',
		title: 'Насоси(помпи)',
	},
	{
		icon: 'category_rezervuarVoda',
		title: 'Резервуари для води',
	},
	{
		icon: 'category_provoda',
		title: 'Провода та шланги',
	},
	{
		icon: 'category_accsecuari',
		title: 'Аксесуари та комплектуючі',
	},
]

///Slides///
export const slides = [
	{
		id: 1,
		src: `${process.env.PUBLIC_URL}/slider/pic_01.webp`,
		title: 'Комплектуючі',
		desc:
			'Ви можете замовити Комплектуючі до парогенераторів за комфортними цінами. Відправлення в день замовлення. ',
	},
	{
		id: 2,
		src: `${process.env.PUBLIC_URL}/slider/pic_02.webp`,
		title: 'Ремонт',
		desc: 'До Вашої уваги послуга термінового ремонту парогенераторів.',
	},
	{
		id: 3,
		src: `${process.env.PUBLIC_URL}/slider/pic_03.webp`,
		title: 'Espresso',
		desc:
			"Espresso is a concentrated form of coffee, served in shots. It's made of two ingredients - finely ground, 100% coffee, and hot water.",
	},
]
