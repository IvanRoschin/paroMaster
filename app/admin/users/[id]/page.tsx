import { getUserById, updateUser } from '@/actions/users'
import AddUserForm from '@/components/admin/AddUserForm'

interface Params {
	id: string
}

const inputs = [
	{
		id: 'name',
		label: 'Ім`я',
		type: 'text',
		placeholder: 'Ім`я...',
		required: true,
	},
	{
		id: 'phone',
		label: 'Телефон',
		type: 'tel',
		placeholder: 'Телефон...',
		required: true,
	},
	{
		id: 'email',
		label: 'Email',
		type: 'email',
		placeholder: 'Email...',
		required: true,
	},
	{
		id: 'password',
		label: 'Password',
		type: 'password',
		placeholder: 'Password...',
		required: true,
	},
]

const selectInputs = [
	{
		id: 'isAdmin',
		as: 'select',
		name: 'isAdmin',
		label: 'isAdmin',
		options: [
			{
				value: 'false',
				label: 'Адмін?',
			},
			{
				value: 'true',
				label: 'Так',
			},
			{
				value: 'false',
				label: 'Ні',
			},
		],
	},
	{
		id: 'isActive',
		as: 'select',
		name: 'isActive',
		label: 'isActive',
		options: [
			{
				value: 'false',
				label: 'Активний?',
			},
			{
				value: 'true',
				label: 'Так',
			},
			{
				value: 'false',
				label: 'Ні',
			},
		],
	},
]

const SingleUserPage = async ({ params }: { params: Params }) => {
	const { id } = params
	const user = await getUserById(id)

	return (
		<div>
			<AddUserForm user={user} title={'Редагувати дані про користувача'} action={updateUser} />
		</div>
		// <div>
		// 	<h2>SingleUserPage</h2>
		// 	<div>
		// 		<form action={updateUser} className='flex-col'>
		// 			<input type='hidden' value={user._id} />

		// 			<input
		// 				type='text'
		// 				placeholder={user.name}
		// 				className='peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed'
		// 			/>
		// 			<label>Email</label>
		// 			<input
		// 				type='email'
		// 				name='email'
		// 				placeholder={user.email}
		// 				className='peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed'
		// 			/>
		// 			<label>Password:</label>
		// 			<input
		// 				type='password'
		// 				name='password'
		// 				placeholder={user.password}
		// 				className='peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed'
		// 			/>
		// 			<label>Phone:</label>
		// 			<input
		// 				type='phone'
		// 				name='phone'
		// 				placeholder={user.phone}
		// 				className='peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed'
		// 			/>
		// 			<label>Is admin?</label>
		// 			<select name='isAdmin' id='isAdmin'>
		// 				<option value='true' selected={user.isAdmin}>
		// 					Так
		// 				</option>
		// 				<option value='false' selected={!user.isAdmin}>
		// 					Ні
		// 				</option>
		// 			</select>
		// 			<label>Is active?</label>
		// 			<select name='isActive' id='isActive'>
		// 				<option value='true' selected={user.isActive}>
		// 					Так
		// 				</option>
		// 				<option value='false' selected={!user.isActive}>
		// 					Ні
		// 				</option>
		// 			</select>
		// 			<button>Update</button>
		// 		</form>
		// 	</div>
		// </div>
	)
}

export default SingleUserPage
