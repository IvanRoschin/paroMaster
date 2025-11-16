import { ChangePasswordForm } from '@/app/components';
import { SessionUser } from '@/types/IUser';

export interface ChangePasswordClient {
  user?: SessionUser;
}
const ChangePasswordClient: React.FC<ChangePasswordClient> = ({ user }) => {
  return <ChangePasswordForm userId={user?._id} />;
};

export default ChangePasswordClient;
