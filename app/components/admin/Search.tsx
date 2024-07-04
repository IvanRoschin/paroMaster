// 'use client'

// import { usePathname, useRouter, useSearchParams } from 'next/navigation'
// import { MdSearch } from 'react-icons/md'
// import { useDebouncedCallback } from 'use-debounce'

// const Search = ({ placeholder }: { placeholder: string }) => {
// 	const searchParams = useSearchParams()
// 	const { replace } = useRouter()
// 	const pathname = usePathname()

// 	const handleSearch = useDebouncedCallback(e => {
// 		const params = new URLSearchParams(searchParams)

// 		params.set('page', 1)

// 		if (e.target.value) {
// 			e.target.value.length > 2 && params.set('q', e.target.value)
// 		} else {
// 			params.delete('q')
// 		}
// 		replace(`${pathname}?${params}`)
// 	}, 300)

// 	return (
// 		<div className='flex items-center gap-2, bg-[#2e374a] p-10 rounded-xl w-max'>
// 			<MdSearch />
// 			<input
// 				type='text'
// 				placeholder={placeholder}
// 				className={'bg-transparent border-none outline-none'}
// 				onChange={handleSearch}
// 			/>
// 		</div>
// 	)
// }

// export default Search
