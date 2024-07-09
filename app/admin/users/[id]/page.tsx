import { getUserById, updateUser } from '@/actions/users'

interface Params {
	id: string
}
const SingleUserPage = async ({ params }: { params: Params }) => {
	const { id } = params
	const user = await getUserById(id)

	return (
		<div>
			<h2>SingleUserPage</h2>
			<div>
				<form action={updateUser} className='flex-col'>
					<input type='hidden' value={user._id} />
					<input
						type='text'
						placeholder={user.name}
						className='peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed'
					/>
					<label>Email</label>
					<input
						type='email'
						name='email'
						placeholder={user.email}
						className='peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed'
					/>
					<label>Password:</label>
					<input
						type='password'
						name='password'
						placeholder={user.password}
						className='peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed'
					/>
					<label>Phone:</label>
					<input
						type='phone'
						name='phone'
						placeholder={user.phone}
						className='peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed'
					/>
					<label>Is admin?</label>
					<select name='isAdmin' id='isAdmin'>
						<option value='true' selected={user.isAdmin}>
							Так
						</option>
						<option value='false' selected={!user.isAdmin}>
							Ні
						</option>
					</select>
					<label>Is active?</label>
					<select name='isActive' id='isActive'>
						<option value='true' selected={user.isActive}>
							Так
						</option>
						<option value='false' selected={!user.isActive}>
							Ні
						</option>
					</select>
					<button>Update</button>
				</form>
			</div>
		</div>
	)
}

export default SingleUserPage
