'use client'

import { deleteCategory } from '@/actions/categories'
import Pagination from '@/components/admin/Pagination'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import Loader from '@/components/Loader'
import Search from '@/components/Search'
import { ICategory } from '@/types/category/ICategory'
import { ISearchParams } from '@/types/searchParams'
import useGetCategories from 'app/hooks/useCategories'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FaPen, FaSortAlphaDown, FaSortAlphaUp, FaTrash } from 'react-icons/fa'
import { toast } from 'sonner'

interface CategoriesResponse {
	success: boolean
	categories: ICategory[]
	count: number
}

const limit = 10

// const fetcher = async (params: ISearchParams): Promise<CategoriesResponse> => {
// 	return getAllCategories(params, limit)
// }

const CategoriesPage = ({ searchParams }: { searchParams: ISearchParams }) => {
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
	const { data, error, isLoading } = useGetCategories({ ...searchParams, sortOrder })

	if (error) {
		console.error('Error fetching categories', error)
		return <div>Error loading categories.</div>
	}

	if (isLoading) {
		return <Loader />
	}

	if (data?.categories.length === 0) {
		return <EmptyState />
	}

	// Sorting handler
	const handleSort = () => {
		setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'))
	}

	const handleDelete = async (id: string) => {
		try {
			const formData = new FormData()
			formData.append('id', id)
			await deleteCategory(formData)
			toast.success('Категорію успішно видалено!')
		} catch (error) {
			toast.error('Помилка при видаленні Категорії!')
			console.error('Error deleting order', error)
		}
	}

	const categoriesCount = data?.count || 0
	const page = searchParams.page ? Number(searchParams.page) : 1
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

	const sortedCategories = [...(data?.categories || [])].sort((a, b) => {
		const comparison = a.title.localeCompare(b.title)
		return sortOrder === 'asc' ? comparison : -comparison
	})

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
						<td className='p-2 border-r-2 text-center flex items-center'>
							<Button
								label='Назва категорії'
								small
								width='80'
								type='button'
								icon={sortOrder === 'asc' ? FaSortAlphaUp : FaSortAlphaDown}
								onClick={handleSort}
								aria-label={`Sort categories ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
							/>
						</td>
						<td className='p-2 border-r-2 text-center'>SVG іконка</td>
						<td className='p-2 border-r-2 text-center'>Редагувати</td>
						<td className='p-2 border-r-2 text-center'>Видалити</td>
					</tr>
				</thead>
				<tbody>
					{sortedCategories.map(category => (
						<tr key={category._id} className='border-b-2'>
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
								<Button
									type='button'
									icon={FaTrash}
									small
									outline
									color='border-red-400'
									onClick={() => {
										if (category._id) {
											handleDelete(category._id)
										} else {
											console.error('Error: Category ID is undefined')
										}
									}}
								/>
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
