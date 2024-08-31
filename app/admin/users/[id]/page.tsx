import { getUserById, updateUser } from '@/actions/users'
import AddUserForm from '@/components/admin/AddUserForm'

interface Params {
	id: string
}

const SingleUserPage = async ({ params }: { params: Params }) => {
	const { id } = params
	const user = await getUserById(id)

	return (
		<div className='mb-20'>
			<AddUserForm user={user} title={'Редагувати дані про користувача'} action={updateUser} />
		</div>
	)
}

export default SingleUserPage
