import { addUser } from "@/actions/users"
import AddUserForm from "@/components/admin/AddUserForm"

type Props = {}

const AddUserPage = (props: Props) => {
  return (
    <div>
      <AddUserForm title="Додати нового користувача" action={addUser} />
    </div>
  )
}

export default AddUserPage
