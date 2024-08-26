'use client'

import { deleteTestimonial, getAllTestimonials } from '@/actions/testimonials'
import Pagination from '@/components/admin/Pagination'
import Button from '@/components/Button'
import { Loader, Search } from '@/components/index'
import { ITestimonial } from '@/types/index'
import { ISearchParams } from '@/types/searchParams'
import Link from 'next/link'
import { useState } from 'react'
import { FaPen, FaTrash } from 'react-icons/fa'
import { toast } from 'sonner'
import useSWR from 'swr'

interface OrdersResponse {
	success: boolean
	testimonials: ITestimonial[]
	count: number
}

const limit = 4

const fetcher = async (params: ISearchParams): Promise<OrdersResponse> => {
	return getAllTestimonials(params, limit)
}

const TestimonialsPage = ({ searchParams }: { searchParams: ISearchParams }) => {
	// State for the selected status filter
	const [statusFilter, setStatusFilter] = useState<string | null>(null)

	// Update searchParams with the selected status filter
	const searchParamsWithStatus = { ...searchParams, status: statusFilter }

	const { data, error } = useSWR(['testimonials', searchParamsWithStatus], () =>
		fetcher(searchParamsWithStatus),
	)

	if (error) {
		console.error('Error fetching testimonials', error)
		return <div>Error loading testimonials.</div>
	}

	if (!data) {
		return <Loader />
	}

	// if (data.testimonials.length === 0) {
	// 	return <EmptyState />
	// }

	const handleDelete = async (id: string) => {
		try {
			const formData = new FormData()
			formData.append('id', id)
			await deleteTestimonial(formData)
			toast.success('Відгук успішно видалено!')
		} catch (error) {
			toast.error('Помилка при видаленні Відгуку!')
			console.error('Error deleting testimonial', error)
		}
	}

	const testimonialsCount = data.count

	const page = searchParams.page

	const totalPages = Math.ceil(testimonialsCount / limit)
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
				<Search placeholder='Знайти відгук' />

				<div className='flex items-center'>
					{/* Status Filter Dropdown */}
					<select
						value={statusFilter || ''}
						onChange={e => setStatusFilter(e.target.value || null)}
						className='border border-gray-300 rounded p-2 text-sm mr-4'
					>
						<option value=''>Всі статуси</option>
						<option value='Опублікований'>Опублікований</option>
						<option value='Не публікується'>Не публікується</option>
					</select>

					<Link href='/admin/testimonials/add'>
						<Button type='button' label='Додати' small outline color='border-green-400' />
					</Link>
				</div>
			</div>
			<div className='p-3'>
				<table className='w-full text-xs mb-8'>
					<thead>
						<tr className='bg-slate-300 font-semibold'>
							<td className='p-2 border-r-2 text-center'>Ім'я користувача</td>
							<td className='p-2 border-r-2 text-center'>Текст відгуку</td>
							<td className='p-2 border-r-2 text-center'>Рейтинг</td>
							<td className='p-2 border-r-2 text-center'>Дата додавання</td>
							<td className='p-2 border-r-2 text-center'>Публікується?</td>
							<td className='p-2 border-r-2 text-center'>Редагувати</td>
							<td className='p-2 text-center'>Видалити</td>
						</tr>
					</thead>
					<tbody>
						{data.testimonials.map(testimonial => (
							<tr key={testimonial._id} className='border-b-2'>
								<td className='p-2 border-r-2 text-center'>{testimonial.name}</td>

								<td className='p-2 border-r-2 text-start'>{testimonial.text}</td>

								<td className='p-2 border-r-2 text-center'>{testimonial.rating}</td>
								<td className='p-2 border-r-2 text-center'>
									{new Date(testimonial.createdAt).toLocaleDateString('uk-UA')}
								</td>
								<td className='p-2 border-r-2 text-center'>
									{testimonial.isActive ? 'Так' : 'Ні'}
								</td>

								<td className='p-2 text-center'>
									<Link href={`/admin/testimonials/${testimonial._id}`}>
										<Button type='button' icon={FaPen} small outline color='border-yellow-400' />
									</Link>
								</td>
								<td className='p-2 text-center'>
									{' '}
									<Button
										type='button'
										icon={FaTrash}
										small
										outline
										color='border-red-400'
										onClick={() => {
											if (testimonial._id) {
												handleDelete(testimonial._id)
											} else {
												console.error('Error: Good ID is undefined')
											}
										}}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Pagination count={testimonialsCount} pageNumbers={pageNumbers} />
		</div>
	)
}

export default TestimonialsPage
