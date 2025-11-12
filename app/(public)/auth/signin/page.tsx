// app/(public)/auth/signin/page.tsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/config/authOptions';
import { LoginForm } from '@/components/index';
import { UserRole } from '@/types/IUser';

type Props = {};

const SignInPage = async (props: Props) => {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const role = session.user.role as UserRole;
    if (role === UserRole.ADMIN) {
      redirect('/admin');
    } else {
      redirect('/customer');
    }
  }
  return <LoginForm />;
};

export default SignInPage;
