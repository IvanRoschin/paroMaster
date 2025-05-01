import { getUserById, updateUser } from "@/actions/users"
import { UserForm } from "@/admin/components"

interface Params {
  id: string
}

const SingleUserPage = async ({ params }: { params: Params }) => {
  const { id } = params
  const user = await getUserById(id)

  return (
    <div className="mb-20">
      <UserForm user={user} title={"Редагувати дані про користувача"} action={updateUser} />
    </div>
  )
}

export default SingleUserPage
