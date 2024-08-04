'use client'

import { deleteGood, getAllGoods } from '@/actions/goods'
import Pagination from '@/components/admin/Pagination'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import { Loader, Search } from '@/components/index'
import { IGood } from '@/types/good/IGood'
import { ISearchParams } from '@/types/searchParams'
import Link from 'next/link'
import { FaPen, FaTrash } from 'react-icons/fa'
import useSWR from 'swr'

interface GoodsResponse {
	success: boolean
	goods: IGood[]
	count: number
}

const fetcher = async (params: ISearchParams): Promise<GoodsResponse> => {
	return getAllGoods(params, 4, 0)
}

const ProductsPage = ({ searchParams }: { searchParams: ISearchParams }) => {
	const page = searchParams?.page || 1

	const { data, error } = useSWR(['goods', searchParams], () => fetcher(searchParams))

	if (error) {
		console.error('Error fetching goods', error)
		return <div>Error loading goods.</div>
	}

	if (!data) {
		return <Loader />
	}

	if (data.goods.length === 0) {
		return <EmptyState />
	}

	const count = data.count

	return (
		<div className='p-3 rounded-xl'>
			<div className='flex items-center justify-between mb-8'>
				<Search placeholder='Знайти товар' />
				<Link href='/admin/goods/add'>
					<Button type='button' label='Додати' small outline color='border-green-400' />
				</Link>
			</div>
			<table className='w-full text-xs'>
				<thead>
					<tr className='bg-slate-300 font-semibold'>
						<td className='p-2 border-r-2 text-center'>Категорія</td>
						<td className='p-2 border-r-2 text-center'>Назва</td>
						<td className='p-2 border-r-2 text-center'>Бренд</td>
						<td className='p-2 border-r-2 text-center'>Модель</td>
						<td className='p-2 border-r-2 text-center'>Артикул</td>
						<td className='p-2 border-r-2 text-center'>Ціна</td>
						<td className='p-2 border-r-2 text-center'>В наявності</td>
						<td className='p-2 border-r-2 text-center'>Редагувати</td>
						<td className='p-2 border-r-2 text-center'>Видалити</td>
					</tr>
				</thead>
				<tbody>
					{data.goods.map(good => (
						<tr key={good._id} className='border-b-2 '>
							<td className='p-2 border-r-2 text-center'>{good.category}</td>
							<td className='p-2 border-r-2 text-center text'>{good.title}</td>
							<td className='p-2 border-r-2 text-center'>{good.brand}</td>
							<td className='p-2 border-r-2 text-center'>{good.model}</td>
							<td className='p-2 border-r-2 text-center'>{good.vendor}</td>
							<td className='p-2 border-r-2 text-center'>{good.price}</td>
							<td className='p-2 border-r-2 text-center'>
								{good.isAvailable ? 'в наявності' : 'відсутній'}
							</td>

							<td className='p-2 border-r-2 text-center'>
								<Link
									href={`/admin/goods/${good._id}`}
									className='flex items-center justify-center'
								>
									<Button type='button' icon={FaPen} small outline color='border-yellow-400' />
								</Link>
							</td>
							<td className='p-2 text-center'>
								<form action={deleteGood} className='flex justify-center items-center'>
									<input type='hidden' name='id' value={good._id} />
									<Button type='submit' icon={FaTrash} small outline color='border-red-400' />
								</form>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Pagination count={count} />
		</div>
	)
}

export default ProductsPage
