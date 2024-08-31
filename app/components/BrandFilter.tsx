'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const BrandFilter = ({ brands }: { brands: string[] }) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { push } = useRouter()

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

	if (brands.length === 0) {
		return <h2 className='text-4xl mb-4'>Бренд не знайдений</h2>
	}

	const handleBrandCheckboxClick = (brand: string) => {
		console.log('brand', brand)
		const selectedBrand = searchParams.get('brand')
		const newBrand = selectedBrand === brand ? null : brand
		push(pathname + '?' + createQueryString('brand', newBrand as string), { scroll: false })
	}

	return (
		<div>
			<h2 className='text-2xl text-primaryAccentColor mb-4 bold'>Бренди</h2>{' '}
			<ul>
				{brands?.map((brand, index) => {
					const isChecked = searchParams.get('brand') === brand
					return (
						<li key={index} className='flex items-center space-x-2'>
							<input
								type='checkbox'
								checked={isChecked}
								onChange={() => handleBrandCheckboxClick(brand)}
								className='custom-checkbox'
								id={`checkbox-${index}`}
							/>
							<label htmlFor={`checkbox-${index}`} className='text-primaryTextColor cursor-pointer'>
								{brand}
							</label>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default BrandFilter
