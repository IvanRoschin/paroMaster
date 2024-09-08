'use client'

import { deleteUser, getAllUsers } from '@/actions/users'
import Search from '@/components/admin/AdminSearch'
import Pagination from '@/components/admin/Pagination'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import Loader from '@/components/Loader'
import { ISearchParams, IUser } from '@/types/index'
import useFetchData from 'app/hooks/useFetchData'
import Link from 'next/link'
import { FaPen, FaTrash } from 'react-icons/fa'

export default function Users({
	searchParams,
	limit,
}: {
	searchParams: ISearchParams
	limit: number
}) {
	const { data, isLoading, isError } = useFetchData(searchParams, limit, getAllUsers, 'users')

	if (isLoading) {
		return <Loader />
	}

	if (isError) {
		return <div>Error fetching data.</div>
	}

	if (!data?.users || data.users.length === 0) {
		return <EmptyState showReset />
	}

	const usersCount = data?.count || 0

	const page = searchParams.page ? Number(searchParams.page) : 1

	const totalPages = Math.ceil(usersCount / limit)
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
		<div className='p-3 rounded-xl'>
			<div className='flex items-center justify-between mb-8'>
				<Search placeholder='Знайти користувача' />
				<Link href='/admin/users/add'>
					<Button type={'submit'} label='Додати' small outline color='border-green-400' />
				</Link>
			</div>
			<table className='w-full text-xs'>
				<thead>
					<tr className='bg-slate-300 font-semibold'>
						<td className='p-2 border-r-2 text-center'>Ім'я</td>
						<td className='p-2 border-r-2 text-center'>Email</td>
						<td className='p-2 border-r-2 text-center'>Телефон</td>
						<td className='p-2 border-r-2 text-center'>Створений</td>
						<td className='p-2 border-r-2 text-center'>Роль</td>
						<td className='p-2 border-r-2 text-center'>Статус</td>
						<td className='p-2 border-r-2 text-center'>Редагувати</td>
						<td className='p-2 border-r-2 text-center'>Видалити</td>
					</tr>
				</thead>
				<tbody>
					{data.users.map((user: IUser) => {
						return (
							<tr key={user._id} className='border-b-2'>
								<td className='p-2 border-r-2 text-center'>{user.name}</td>
								<td className='p-2 border-r-2 text-center'>{user.email}</td>
								<td className='p-2 border-r-2 text-center'>{user.phone}</td>
								<td className='p-2 border-r-2 text-center'>
									{new Date(user.createdAt).toLocaleDateString('uk-UA')}
								</td>
								<td className='p-2 border-r-2 text-center'>{user.isAdmin ? 'admin' : 'user'}</td>
								<td className='p-2 border-r-2 text-center'>
									{user.isActive ? 'active' : 'passive'}
								</td>
								<td className='p-2 border-r-2 text-center'>
									<Link
										href={`/admin/users/${user._id}`}
										className='flex items-center justify-center'
									>
										<Button type={'submit'} icon={FaPen} small outline color='border-yellow-400' />
									</Link>
								</td>
								<td className='p-2 text-center'>
									{' '}
									<form action={deleteUser} className='flex justify-center items-center'>
										<input type='hidden' name='id' value={user._id} />
										<Button type='submit' icon={FaTrash} small outline color='border-red-400' />
									</form>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
			<Pagination count={usersCount} pageNumbers={pageNumbers} />
		</div>
	)
}
