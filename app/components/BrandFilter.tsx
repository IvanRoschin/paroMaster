'use client'

import { uniqueBrands } from '@/actions/goods'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

const BrandFilter = () => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { push } = useRouter()

	const [brands, setBrands] = useState<string[]>([])

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

	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const uniqueBrandsData = await uniqueBrands()
				setBrands(uniqueBrandsData || [])
			} catch (error) {
				console.error('Error fetching unique brands:', error)
			}
		}

		fetchBrands()
	}, [])

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
				{brands.map((brand, index) => {
					const isChecked = searchParams.get('brand') === brand
					return (
						<li key={index}>
							<input
								type='checkbox'
								checked={isChecked}
								onChange={() => handleBrandCheckboxClick(brand)}
							/>
							{'  '}
							{'  '}
							{brand}
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default BrandFilter
