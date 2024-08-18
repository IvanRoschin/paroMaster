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
import { toast } from 'sonner'
import useSWR from 'swr'

interface GoodsResponse {
	success: boolean
	goods: IGood[]
	count: number
}

const limit = 4

const fetcher = async (params: ISearchParams): Promise<GoodsResponse> => {
	return getAllGoods(params, limit)
}

const ProductsPage = ({ searchParams }: { searchParams: ISearchParams }) => {
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

	const handleDelete = async (id: string) => {
		try {
			const formData = new FormData()
			formData.append('id', id)
			await deleteGood(formData)
			toast.success('Товар успішно видалено!')
		} catch (error) {
			toast.error('Помилка при видаленні товару!')
			console.error('Error deleting good', error)
		}
	}

	const goodsCount = data.count

	const page = searchParams.page

	const totalPages = Math.ceil(goodsCount / limit)
	const pageNumbers = []
	const offsetNumber = 3

	if (page) {
		for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
			if (i >= 1 && i <= totalPages) {
				pageNumbers.push(i)
			}
		}
	}

	return (
		<div className='p-3'>
			<div className='flex items-center justify-between mb-8'>
				<Search placeholder='Знайти товар' />
				<Link href='/admin/goods/add'>
					<Button type='button' label='Додати' small outline color='border-green-400' />
				</Link>
			</div>
			<table className='w-full text-xs mb-8'>
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
							<td className='p-2 border-r-2 text-start'>{good.category}</td>
							<td className='p-2 border-r-2 text-start'>{good.title}</td>
							<td className='p-2 border-r-2 text-center'>{good.brand}</td>
							<td className='p-2 border-r-2 text-center'>{good.model}</td>
							<td className='p-2 border-r-2 text-center'>{good.vendor}</td>
							<td className='p-2 border-r-2 text-center'>{good.price}</td>
							<td className='p-2 border-r-2 text-center'>{good.isAvailable ? 'Так' : 'Ні'}</td>

							<td className='p-2 border-r-2 text-center'>
								<Link
									href={`/admin/goods/${good._id}`}
									className='flex items-center justify-center'
								>
									<Button type='button' icon={FaPen} small outline color='border-yellow-400' />
								</Link>
							</td>
							<td className='p-2 text-center'>
								<Button
									type='button'
									icon={FaTrash}
									small
									outline
									color='border-red-400'
									onClick={() => {
										if (good._id) {
											handleDelete(good._id)
										} else {
											console.error('Error: Good ID is undefined')
										}
									}}
								/>
								{/* <form action={deleteGood} className='flex justify-center items-center'>
									<input type='hidden' name='id' value={good._id} />
									<Button type='submit' icon={FaTrash} small outline color='border-red-400' />
								</form> */}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Pagination count={goodsCount} pageNumbers={pageNumbers} />
		</div>
	)
}

export default ProductsPage
