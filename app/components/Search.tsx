'use client'
import useCustomRouter from 'app/hooks/useCustomRouter'
import { useSearchParams } from 'next/navigation'
import { FormEventHandler, useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'

const Search = () => {
	const { pushQuery, query } = useCustomRouter()
	const params = useSearchParams()
	const searchValue = params.get('search')

	const [searchQuery, setSearchQuery] = useState<FormDataEntryValue | null>(' ')
	const [inputValue, setInputValue] = useState<string | null>(searchValue)

	useEffect(() => {
		setInputValue(searchValue)
	}, [searchValue])

	const handleSearch: FormEventHandler<HTMLFormElement> = async event => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const search = formData.get('search')

		if (typeof search === 'string') {
			pushQuery({ search, sort: null })
		}
		setSearchQuery(search)
		console.log(typeof searchQuery)
		console.log('searchQuery', searchQuery)
	}

	return (
		<form className='w-full mx-7' onSubmit={handleSearch}>
			<label className='mb-2 text-sm font-medium text-gray-900 sr-only'>Search</label>
			<div className='relative w-full flex justify-center items-center'>
				<div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
					<CiSearch />
				</div>
				<input
					type='text'
					name='search'
					className='relative py-1 block w-full ps-10 mr-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primaryAccentColor focus:border-primaryAccentColor '
					placeholder='Код товару, артикул або модель...'
					required
					value={inputValue || ''}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setInputValue(e.target.value)
					}}
				/>
				<button
					type='button'
					className='absolute top-0 right-0'
					onClick={() => {
						console.log('Click')
						pushQuery({ search: '', sort: null })
					}}
				>
					x
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
