'use client'

type Props = {}

const Search = (props: Props) => {
	return (
		<form className='w-full mx-7'>
			<label className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
				Search
			</label>
			<div className='w-full flex justify-center items-center'>
				<div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
					<svg
						className='w-4 h-4 text-gray-500 dark:text-gray-400'
						aria-hidden='true'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 20 20'
					>
						<path
							stroke='currentColor'
							stroke-linecap='round'
							stroke-linejoin='round'
							stroke-width='2'
							d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
						/>
					</svg>
				</div>
				<input
					type='search'
					id='default-search'
					className='block w-full ps-10 mr-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
					placeholder='Код товару, артикул або модель...'
					required
				/>
				<button
					type='submit'
					className='text-white end-2.5 bottom-2.5 bg-gray-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm px-4 py-1'
				>
					Знайти
				</button>
			</div>
		</form>
	)
}

export default Search
