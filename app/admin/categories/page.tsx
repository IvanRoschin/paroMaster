'use client'

import { deleteCategory, getAllCategories } from '@/actions/categories'
import Pagination from '@/components/admin/Pagination'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import Loader from '@/components/Loader'
import Search from '@/components/Search'
import { ICategory } from '@/types/category/ICategory'
import { ISearchParams } from '@/types/searchParams'
import Image from 'next/image'
import Link from 'next/link'
import { FaPen, FaTrash } from 'react-icons/fa'
import useSWR from 'swr'

interface CategoriesResponse {
	success: boolean
	categories: ICategory[]
	count: number
}

const limit = 4

const fetcher = async (params: ISearchParams): Promise<CategoriesResponse> => {
	return getAllCategories(params, limit)
}

const CategoriesPage = ({ searchParams }: { searchParams: ISearchParams }) => {
	const { data, error } = useSWR(['categories', searchParams], () => fetcher(searchParams))

	if (error) {
		console.error('Error fetching categories', error)
		return <div>Error loading categories.</div>
	}

	if (!data) {
		return <Loader />
	}

	if (data.categories.length === 0) {
		return <EmptyState />
	}

	const categoriesCount = data.count

	const page = searchParams.page

	const totalPages = Math.ceil(categoriesCount / limit)
	const pageNumbers = []
	const offsetNumber = 3

	if (page) {
		for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
			if (i >= 1 && i <= totalPages) {
				pageNumbers.push(i)
			}
		}
	}
	console.log('data.categories', data.categories)

	return (
		<div className='p-3'>
			<div className='flex items-center justify-between mb-8'>
				<Search placeholder='Знайти категорію' />
				<Link href='/admin/categories/add'>
					<Button type='button' label='Додати' small outline color='border-green-400' />
				</Link>
			</div>
			<table className='w-full text-xs mb-8'>
				<thead>
					<tr className='bg-slate-300 font-semibold'>
						<td className='p-2 border-r-2 text-center'>Назва категорії</td>
						<td className='p-2 border-r-2 text-center'>SVG іконка</td>
						<td className='p-2 border-r-2 text-center'>Редагувати</td>
						<td className='p-2 border-r-2 text-center'>Видалити</td>
					</tr>
				</thead>
				<tbody>
					{data.categories.map(category => (
						<tr key={category._id} className='border-b-2 '>
							<td className='p-2 border-r-2 text-start'>{category.title}</td>
							<td className='p-2 border-r-2 text-start'>
								<div className='flex justify-center'>
									<Image src={category.src} alt={category.title} width={24} height={24} />
								</div>
							</td>
							<td className='p-2 border-r-2 text-center'>
								<Link
									href={`/admin/categories/${category._id}`}
									className='flex items-center justify-center'
								>
									<Button type='button' icon={FaPen} small outline color='border-yellow-400' />
								</Link>
							</td>
							<td className='p-2 text-center'>
								<form action={deleteCategory} className='flex justify-center items-center'>
									<input type='hidden' name='id' value={category._id} />
									<Button type='submit' icon={FaTrash} small outline color='border-red-400' />
								</form>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Pagination count={categoriesCount} pageNumbers={pageNumbers} />
		</div>
	)
}

export default CategoriesPage
