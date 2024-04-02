'use client'

import useCustomRouter from 'app/hooks/useCustomRouter'
import { CiSearch } from 'react-icons/ci'

const Search = () => {
	const { pushQuery, query } = useCustomRouter()

	async function handleSearch(formData: FormData) {
		const search = formData.get('search')
		if (typeof search === 'string') {
			pushQuery({ search })
		}
	}
	return (
		<form className='w-full mx-7' action={handleSearch}>
			<label className='mb-2 text-sm font-medium text-gray-900 sr-only'>Search</label>
			<div className='relative w-full flex justify-center items-center'>
				<div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
					<CiSearch />
				</div>
				<input
					type='search'
					name='search'
					className='py-1 block w-full ps-10 mr-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primaryAccentColor focus:border-primaryAccentColor '
					placeholder='Код товару, артикул або модель...'
					required
					defaultValue={''}
				/>
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
