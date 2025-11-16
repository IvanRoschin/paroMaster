import { getServerSession } from 'next-auth';

import { getUserById } from '@/app/actions/users';
import { authOptions } from '@/app/config/authOptions';
import { IUser } from '@/types/IUser';

import ChangeUserDataClient from './ChangeUserDataClient';

export default async function changeUserDataPage() {
  const session = await getServerSession(authOptions);
  let user: IUser | undefined = undefined;
  if (session?.user?._id) {
    user = (await getUserById(session.user._id)) || undefined;
  }
  return <ChangeUserDataClient user={user} />;
}
