'use client'

import { deleteUser, getAllUsers } from '@/actions/users'
import Search from '@/components/admin/AdminSearch'
import Pagination from '@/components/admin/Pagination'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import Loader from '@/components/Loader'
import { ISearchParams } from '@/types/searchParams'
import { IUser } from '@/types/user/IUser'
import Link from 'next/link'
import { FaPen, FaTrash } from 'react-icons/fa'
import useSWR from 'swr'

interface UserResponse {
	success: boolean
	users: IUser[]
	count: number
}

const limit = 4

const fetcher = async (url: string, params: ISearchParams): Promise<UserResponse> => {
	return getAllUsers(params, limit)
}

const UsersPage = ({ searchParams }: { searchParams: ISearchParams }) => {
	const { data, error } = useSWR(['users', searchParams], () => fetcher('users', searchParams))

	if (error) {
		console.error('Error fetching users', error)
	}
	if (data?.users.length === 0) {
		return <EmptyState />
	}
	if (!data) {
		return <Loader />
	}

	const page = searchParams?.page || 1

	const usersCount = data.count

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
				<Link
					href='/admin/users/add'
					className='
				'
				>
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
					{data.users.map(user => {
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

export default UsersPage
