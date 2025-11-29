import { getServerSession } from 'next-auth';

import { getUserByIdAction } from '@/app/actions/users';
import { authOptions } from '@/app/config/authOptions';
import { IUser } from '@/types/IUser';
import ChangeUserDataClient from './ChangeUserDataClient';

export default async function changeUserDataPage() {
  const session = await getServerSession(authOptions);
  let user: IUser | undefined = undefined;
  if (session?.user?.id) {
    user = (await getUserByIdAction(session.user.id)) || undefined;
  }
  return <ChangeUserDataClient user={user} />;
}
