import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/config/authOptions';
import { SessionUser } from '@/types/IUser';
import ChangePasswordClient from './ChangePasswordClient';

export default async function changePasswordPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser;

  return <ChangePasswordClient user={user} />;
}
