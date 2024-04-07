'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const useCustomRouter = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const query: { [key: string]: string } = {}

	let search = searchParams.get('search') || ''
	let sort = searchParams.get('sort')

	if (search) query.search = search
	if (sort !== null && sort !== undefined) query.sort = sort

	const pushQuery = ({
		search,
		sort,
	}: {
		search: string | null | undefined
		sort: string | null
	}) => {
		if (search === '') {
			delete query['search']
		} else {
			query['search'] = search ?? '' // Используйте оператор ?? для установки значения по умолчанию
		}
		if (sort !== null && sort !== undefined) {
			query['sort'] = sort ?? '' // Используйте оператор ?? для установки значения по умолчанию
		} else {
			delete query['sort']
		}

		const newQuery = new URLSearchParams(query).toString()
		router.push(`?${newQuery}`)
	}

	return { query, pushQuery }
}

export default useCustomRouter
