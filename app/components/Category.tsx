'use client'
import Link from 'next/link'
import { Icon } from './Icon'

import { categoryList } from 'app/config/constants'
import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

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
			<h2 className='subtitle mb-4'>Категорії товарів</h2>
			<ul className='bg-secondaryBackground p-4 rounded-lg'>
				{categoryList.map(({ icon, title }, index) => {
					return (
						<li key={index} className='mb-3 nav'>
							<Link
								href={`${process.env.PUBLIC_URL}/category/?${createQueryString('category', title)}`}
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
