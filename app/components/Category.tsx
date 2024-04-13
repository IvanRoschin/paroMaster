'use client'
import Link from 'next/link'
import { Icon } from './Icon'

import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export const categoryList = [
	{
		iconName: 'category_korpusniDetali',
		categoryName: 'Корпус станції',
	},
	{
		iconName: 'category_korpusUtuga',
		categoryName: 'Корпус для прасок',
	},
	{
		iconName: 'category_pidoshvaUtuga',
		categoryName: 'Підошви для прасок',
	},
	{
		iconName: 'category_platu',
		categoryName: 'Плати керування',
	},
	{
		iconName: 'category_boiler',
		categoryName: 'Бойлери',
	},
	{
		iconName: 'category_electroKlapan',
		categoryName: 'Електроклапани',
	},
	{
		iconName: 'category_nasos',
		categoryName: 'Насоси(помпи)',
	},
	{
		iconName: 'category_rezervuarVoda',
		categoryName: 'Резервуари для води',
	},
	{
		iconName: 'category_provoda',
		categoryName: 'Провода та шланги',
	},
	{
		iconName: 'category_accsecuari',
		categoryName: 'Аксесуари та комплектуючі',
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
		<div className='pt-0 mr-4 text-sm w-[250px]'>
			<h2 className='text-2xl text-primaryAccentColor mb-4 bold'>Категорії товарів</h2>
			<ul className='bg-secondaryBackground p-4'>
				{categoryList.map(({ iconName, categoryName }, index) => {
					return (
						<li key={index} className='mb-3 nav'>
							<Link
								href={`/category?${createQueryString('category', categoryName)}`}
								className='flex justify-start items-start'
							>
								<Icon name={iconName} className='w-5 h-5  mr-3' />
								{categoryName}
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default Category
