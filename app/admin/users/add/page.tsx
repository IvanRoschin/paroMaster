import { addUser } from "@/actions/users"
import { UserForm } from "@/admin/components"

type Props = {}

const AddUserPage = (props: Props) => {
  return (
    <div>
      <UserForm title="Додати нового користувача" action={addUser} />
    </div>
  )
}

export default AddUserPage
