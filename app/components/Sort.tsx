'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const Sort = () => {
	const [sort, setSort] = useState('')
	const searchParams = useSearchParams()
	const pathName = usePathname()
	const { push } = useRouter()

	return (
		<div>
			Сортувати за ціною:
			<select
				value={sort}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
					const params = new URLSearchParams(searchParams)
					if (e.target.value) {
						params.set('sort', e.target.value)
					} else {
						params.delete('sort')
					}
					setSort(e.target.value)
					push(`${pathName}?${params.toString()}`, { scroll: false })
				}}
			>
				<option value='' disabled>
					Вибрати
				</option>
				<option value='asc'>Найдешевші</option>
				<option value='desc'>Найдорожчі</option>
			</select>
		</div>
	)
}

export default Sort
