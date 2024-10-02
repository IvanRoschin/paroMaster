'use client'

import { deleteTestimonial, getAllTestimonials, updateTestimonial } from '@/actions/testimonials'
import Pagination from '@/components/admin/Pagination'
import Button from '@/components/Button'
import { EmptyState, Loader, Search, Switcher } from '@/components/index'
import { useDeleteData, useFetchData } from '@/hooks/index'
import { ISearchParams } from '@/types/searchParams'
import Link from 'next/link'
import { useState } from 'react'
import { FaPen, FaTrash } from 'react-icons/fa'
import { toast } from 'sonner'

export default function Testimonials({
	searchParams,
	limit,
}: {
	searchParams: ISearchParams
	limit: number
}) {
	const [statusFilter, setStatusFilter] = useState<string | null>(null)

	const { data, isLoading, isError } = useFetchData(
		{ ...searchParams, statusFilter },
		limit,
		getAllTestimonials,
		'testimonials',
	)
	const { mutate: deleteTestimonialById } = useDeleteData(deleteTestimonial, 'testimonials')

	const handleDelete = (id: string) => {
		deleteTestimonialById(id)
	}

	if (isLoading) {
		return <Loader />
	}

	if (isError) {
		return <div>Error fetching data.</div>
	}

	if (!data?.testimonials || data.testimonials.length === 0) {
		return <EmptyState showReset />
	}

	const handleStatusToggle = async (id: string, currentStatus: boolean) => {
		try {
			const formData = new FormData()
			formData.append('id', id)
			formData.append('isActive', (!currentStatus).toString())
			await updateTestimonial(formData)
			toast.success('Статус відгуку змінено!')
		} catch (error) {
			toast.error('Помилка при зміні статусу відгуку!')
			console.error('Error updating testimonial status', error)
		}
	}

	const testimonialsCount = data?.count || 0

	const page = searchParams.page ? Number(searchParams.page) : 1

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
									<Switcher
										checked={testimonial.isActive}
										onChange={() =>
											testimonial._id && handleStatusToggle(testimonial._id, testimonial.isActive)
										}
									/>
								</td>
								<td className='p-2 text-center'>
									<Link href={`/admin/testimonials/${testimonial._id}`}>
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
										onClick={() => testimonial._id && handleDelete(testimonial._id.toString())}
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
