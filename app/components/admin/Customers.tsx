'use client'

import { deleteCustomer, getAllCustomers } from '@/actions/customers'
import Pagination from '@/components/admin/Pagination'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import { Loader, Search } from '@/components/index'
import { ISearchParams } from '@/types/searchParams'
import useFetchData from 'app/hooks/useFetchData'
import Link from 'next/link'
import { FaPen, FaTrash } from 'react-icons/fa'

export default function Customers({
	searchParams,
	limit,
}: {
	searchParams: ISearchParams
	limit: number
}) {
	const { data, isLoading, isError } = useFetchData(
		searchParams,
		limit,
		getAllCustomers,
		'customers',
	)

	if (isLoading) {
		return <Loader />
	}

	if (isError) {
		return <div>Error fetching data.</div>
	}

	if (!data?.customers || data.customers.length === 0) {
		return <EmptyState showReset />
	}

	const customersCount = data?.count || 0

	const page = searchParams.page ? Number(searchParams.page) : 1

	const totalPages = Math.ceil(customersCount / limit)
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
				<Search placeholder='Знайти клієнта' />
				<Link href='/admin/customers/add'>
					<Button type='button' label='Додати' small outline color='border-green-400' />
				</Link>
			</div>
			<table className='w-full text-xs mb-8'>
				<thead>
					<tr className='bg-slate-300 font-semibold'>
						<td className='p-2 border-r-2 text-center'>Ім'я та Прізвище</td>
						<td className='p-2 border-r-2 text-center'>Телефон</td>
						<td className='p-2 border-r-2 text-center'>E-mail</td>
						<td className='p-2 border-r-2 text-center'>Місто</td>
						<td className='p-2 border-r-2 text-center'>Склад</td>
						<td className='p-2 border-r-2 text-center'>Спосіб оплати</td>
						<td className='p-2 border-r-2 text-center'>Редагувати</td>
						<td className='p-2 border-r-2 text-center'>Видалити</td>
					</tr>
				</thead>
				<tbody>
					{data.customers.map(customer => (
						<tr key={customer._id} className='border-b-2 '>
							<td className='p-2 border-r-2 text-start'>{customer.name}</td>
							<td className='p-2 border-r-2 text-start'>{customer.phone}</td>
							<td className='p-2 border-r-2 text-start'>{customer.email}</td>
							<td className='p-2 border-r-2 text-center'>{customer.city}</td>
							<td className='p-2 border-r-2 text-center'>{customer.warehouse}</td>
							<td className='p-2 border-r-2 text-center'>{customer.payment}</td>

							<td className='p-2 border-r-2 text-center'>
								<Link
									href={`/admin/customers/${customer._id}`}
									className='flex items-center justify-center'
								>
									<Button type='button' icon={FaPen} small outline color='border-yellow-400' />
								</Link>
							</td>
							<td className='p-2 text-center'>
								<form action={deleteCustomer} className='flex justify-center items-center'>
									<input type='hidden' name='id' value={customer._id} />
									<Button type='submit' icon={FaTrash} small outline color='border-red-400' />
								</form>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Pagination count={customersCount} pageNumbers={pageNumbers} />
		</div>
	)
}
