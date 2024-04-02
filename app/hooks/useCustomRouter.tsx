import { useRouter, useSearchParams } from 'next/navigation'

const useCustomRouter = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const query: { [key: string]: string } = {}
	let search = searchParams.get('search') || ''

	if (search) query.search = search

	const pushQuery = ({ search }: { search: string | null }) => {
		if (search !== undefined && search !== null) {
			search === '' ? delete query.search : (query.search = search)
		}
		const newQuery = new URLSearchParams(query).toString()
		router.push(`?${newQuery}`)
	}
	return { query, pushQuery }
}

export default useCustomRouter
