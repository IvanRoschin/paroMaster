'use client'

import { SortOrder } from 'mongoose'
import { useRouter, useSearchParams } from 'next/navigation'

const useCustomRouter = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const query: { [key: string]: string } = {}

	let search = searchParams.get('search') || ''
	let sort = searchParams.get('sort') || 'asc'

	// if (search) query.search = search
	// if (sort) query.sort = sort

	const pushQuery = ({
		search,
		sort,
	}: {
		search: string
		sort: SortOrder | { $meta: any } | undefined
	}) => {
		if (search === '') {
			delete query['search']
		} else {
			query['search'] = search ?? ''
		}
		query['sort'] = sort

		const newQuery = new URLSearchParams(query).toString()
		router.push(`?${newQuery}`)
	}

	return { query, pushQuery }
}

export default useCustomRouter
