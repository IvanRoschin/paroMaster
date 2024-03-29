'use client'

import { Icon } from './Icon'

type Props = {}

const Search = (props: Props) => {
	return (
		<form className='w-full mx-7'>
			<label className='mb-2 text-sm font-medium text-gray-900 sr-only'>Search</label>
			<div className='relative w-full flex justify-center items-center'>
				<div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
					<Icon name='lucide/loop' className='w-4 h-4' />
				</div>
				<input
					type='search'
					id='default-search'
					className='py-1 block w-full ps-10 mr-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 '
					placeholder='Код товару, артикул або модель...'
					required
				/>
				<button
					type='submit'
					className='text-white end-2.5 bottom-2.5 bg-gray-400 hover:bg-primaryAccentColor focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm px-4 py-1'
				>
					Знайти
				</button>
			</div>
		</form>
	)
}

export default Search
