import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/config/authOptions';
import { routes } from '@/app/helpers/routes';

export default async function AuthRedirectPage() {
  const session = await getServerSession(authOptions);
  const callBackUrl = `${routes.publicRoutes.auth.signIn}`;

  if (!session) {
    redirect(callBackUrl);
  }

  switch (session.user.role) {
    case 'admin':
      redirect(`${routes.adminRoutes.dashboard}`);
    case 'customer':
      redirect(`${routes.customerRoutes.dashboard}`);
    default:
      redirect('/');
  }
}
