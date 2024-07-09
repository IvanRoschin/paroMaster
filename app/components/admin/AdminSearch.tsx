'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { useDebouncedCallback } from 'use-debounce'
import { Icon } from '../Icon'

const Search = ({ placeholder }: { placeholder: string }) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()
	const [inputValue, setInputValue] = useState<string>('')

	const handleSearch = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const params = new URLSearchParams(searchParams)
		params.set('page', '1')

		const searchValue = e.target.value

		if (searchValue.length > 2) {
			params.set('q', searchValue)
		} else {
			params.delete('q')
		}
		setInputValue(e.target.value)
		replace(`${pathname}?${searchParams.toString()}`, { scroll: false })
	}, 300)

	return (
		<form className='w-full mx-7'>
			<label className='mb-2 text-sm font-medium text-gray-900 sr-only'>Пошук</label>
			<div className='relative w-full flex justify-center items-center'>
				<div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
					<CiSearch />
				</div>
				<input
					type='text'
					name='search'
					className=' relative py-1 block w-full ps-10 mr-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primaryAccentColor focus:border-primaryAccentColor '
					placeholder={placeholder}
					required
					value={inputValue || ''}
					onChange={handleSearch}
				/>
				<button
					type='button'
					className={`absolute top-[15%] right-[120px] ${inputValue ? 'block' : 'hidden'}`}
					style={{ display: inputValue ? 'block' : 'none' }}
					onClick={() => {
						setInputValue('')
						replace(`${pathname}`, { scroll: false })
					}}
				>
					<Icon
						name={'icon_close'}
						className={`w-5 h-5 border border-primaryAccentColor  text-primaryAccentColor p-1 rounded-full 
                hover:bg-primaryAccentColor focus:bg-[primaryAccentColor] ${
									inputValue ? 'block' : 'hidden'
								}`}
					/>
				</button>
				<button
					type='submit'
					className='text-white end-2.5 bottom-2.5 bg-primaryAccentColor hover:bg-secondaryBackground hover:text-black focus:text-black focus:ring-4 focus:outline-none focus:ring-secondaryBackground font-medium rounded-lg text-sm px-4 py-1'
				>
					Знайти
				</button>
			</div>
		</form>
	)
}

export default Search
