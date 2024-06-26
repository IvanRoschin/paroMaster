'use client'
import Link from 'next/link'
import { Icon } from './Icon'

import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

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

const Category = () => {
	const searchParams = useSearchParams()

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString())
			if (value) {
				params.set(name, value)
			} else {
				params.delete(name)
			}
			return params.toString()
		},
		[searchParams],
	)

	return (
		<div className='pt-0 mr-4 text-sm w-[250px] mb-4'>
			<h2 className='text-2xl text-primaryAccentColor mb-4 bold'>Категорії товарів</h2>
			<ul className='bg-secondaryBackground p-4 rounded-lg'>
				{categoryList.map(({ icon, title }, index) => {
					return (
						<li key={index} className='mb-3 nav'>
							<Link
								href={`/category/?${createQueryString('category', title)}`}
								className='flex justify-start items-start'
							>
								<Icon name={icon} className='w-5 h-5  mr-3' />
								{title}
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default Category
