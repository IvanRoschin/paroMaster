'use client'

import { deleteSlide, getAllSlides } from '@/actions/slider'
import Pagination from '@/components/admin/Pagination'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import Loader from '@/components/Loader'
import Search from '@/components/Search'
import { ISearchParams } from '@/types/searchParams'
import useFetchData from 'app/hooks/useFetchData'
import Image from 'next/image'
import Link from 'next/link'
import { FaPen, FaTrash } from 'react-icons/fa'
import { toast } from 'sonner'

const limit = 10

const SlidesPage = ({ searchParams }: { searchParams: ISearchParams }) => {
	const { data, isLoading, isError } = useFetchData(searchParams, limit, getAllSlides, 'slides')

	if (isLoading) {
		return <Loader />
	}

	if (isError) {
		return <div>Error fetching data.</div>
	}

	if (!data?.slides || data.slides.length === 0) {
		return <EmptyState showReset />
	}

	const handleDelete = async (id: string) => {
		try {
			const formData = new FormData()
			formData.append('id', id)
			await deleteSlide(formData)
			toast.success('Слайд успішно видалено!')
		} catch (error) {
			toast.error('Помилка при видаленні Слайду!')
			console.error('Error deleting slide', error)
		}
	}

	const slidesCount = data?.count || 0

	const page = searchParams.page ? Number(searchParams.page) : 1

	const totalPages = Math.ceil(slidesCount / limit)
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
				<Search placeholder='Знайти слайд' />
				<Link href='/admin/slider/add'>
					<Button type='button' label='Додати' small outline color='border-green-400' />
				</Link>
			</div>
			<table className='w-full text-xs mb-8'>
				<thead>
					<tr className='bg-slate-300 font-semibold'>
						<td className='p-2 border-r-2 text-center'>Заголовок</td>
						<td className='p-2 border-r-2 text-center'>Опис</td>
						<td className='p-2 border-r-2 text-center'>Зображення</td>
						<td className='p-2 border-r-2 text-center'>Редагувати</td>
						<td className='p-2 border-r-2 text-center'>Видалити</td>
					</tr>
				</thead>
				<tbody>
					{data?.slides.map(slide => (
						<tr key={slide._id} className='border-b-2 '>
							<td className='p-2 border-r-2 text-start'>{slide.title}</td>
							<td className='p-2 border-r-2 text-start'>{slide.desc}</td>
							<td className='p-2 border-r-2 text-start'>
								<div className='flex justify-center'>
									<Image src={slide.src} alt={slide.title} width={100} height={100} />
								</div>
							</td>
							<td className='p-2 border-r-2 text-center'>
								<Link
									href={`/admin/slider/${slide._id}`}
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
										if (slide._id) {
											handleDelete(slide._id)
										} else {
											console.error('Error: Slide ID is undefined')
										}
									}}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Pagination count={slidesCount} pageNumbers={pageNumbers} />
		</div>
	)
}

export default SlidesPage
