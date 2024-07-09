import { deleteUser, getAllUsers } from '@/actions/users'
import Search from '@/components/admin/AdminSearch'
import Pagination from '@/components/admin/Pagination'
import { ISearchParams } from '@/types/searchParams'
import { IUser } from '@/types/user/IUser'
import Link from 'next/link'

interface UserResponse {
	success: boolean
	data: IUser[]
	count: number
}

const UsersPage = async ({ searchParams }: { searchParams: ISearchParams }) => {
	const page = searchParams?.page || 1

	const users: UserResponse = await getAllUsers(searchParams)
	if (!users.success) {
		return <div>Error fetching users</div>
	}
	const count = users.count

	return (
		<div className='p-3 rounded-xl'>
			<div className='flex items-center justify-between'>
				<Search placeholder='Знайти користувача' />
				<Link href='/admin/users/add'>
					<button>Add New</button>
				</Link>
			</div>
			<table className='w-full'>
				<thead>
					<tr>
						<td className='p-2'>Name</td>
						<td className='p-2'>Email</td>
						<td className='p-2'>Phone</td>
						<td className='p-2'>Created At</td>
						<td className='p-2'>Role</td>
						<td className='p-2'>Status</td>
						<td className='p-2'>Actions</td>
					</tr>
				</thead>
				<tbody>
					{users.data.map(user => {
						console.log(user._id)
						return (
							<tr key={user._id}>
								<td className='p-2'>{user.name}</td>
								<td className='p-2'>{user.email}</td>
								<td className='p-2'>{user.phone}</td>
								<td className='p-2'>{new Date(user.createdAt).toLocaleDateString('uk-UA')}</td>
								<td className='p-2'>{user.isAdmin ? 'admin' : 'user'}</td>
								<td className='p-2'>{user.isActive ? 'active' : 'passive'}</td>
								<td className='p-2'>
									<div className='flex gap-2'>
										<Link href={`/admin/users/${user._id}`}>
											<button className='px-2 py-3 rounded-lg border-none cursor-pointer bg-teal-400'>
												View
											</button>
										</Link>
										<form action={deleteUser}>
											<input type='hidden' name='id' value={user._id} />
											<button
												type='submit'
												className='px-2 py-3 rounded-lg border-none cursor-pointer bg-red-500'
											>
												Delete
											</button>
										</form>
									</div>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
			<Pagination count={count} />
		</div>
	)
}

export default UsersPage
