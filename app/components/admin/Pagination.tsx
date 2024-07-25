'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
	count: number
}

const Pagination = ({ count }: Props) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()
	const params = new URLSearchParams(searchParams)
	const page = parseInt(searchParams.get('page') || '1')
	const ITEM_PER_PAGE = 1

	const hasPrev = ITEM_PER_PAGE * (page - 1) > 0
	const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count

	const handleChangePage = (type: 'prev' | 'next') => {
		const newPage = type === 'prev' ? page - 1 : page + 1
		params.set('page', newPage.toString())
		replace(`${pathname}?${params.toString()}`, { scroll: false })
	}

	return (
		<div className='flex p-2 justify-between'>
			<button
				className='cursor-pointer px-1 py-2 disabled:cursor-not-allowed'
				disabled={!hasPrev}
				onClick={() => handleChangePage('prev')}
			>
				Назад
			</button>
			<button
				className='cursor-pointer px-1 py-2 disabled:cursor-not-allowed'
				disabled={!hasNext}
				onClick={() => handleChangePage('next')}
			>
				Вперед
			</button>
		</div>
	)
}

export default Pagination
