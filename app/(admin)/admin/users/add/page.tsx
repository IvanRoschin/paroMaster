import { addUserAction } from '@/actions/users';
import { UserForm } from '@/admin/components';

type Props = {};

const AddUserPage = (props: Props) => {
  return (
    <div>
      <UserForm title="Додати нового користувача" action={addUserAction} />
    </div>
  );
};

export default AddUserPage;
