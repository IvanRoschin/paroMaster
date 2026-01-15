import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/config/authOptions';
import { routes } from '@/app/helpers/routes';

export default async function AuthRedirectPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect(routes.publicRoutes.auth.signIn);
  }

  const role = session.user.role;

  if (role === 'admin') {
    return redirect(routes.adminRoutes.dashboard);
  }

  if (role === 'customer') {
    return redirect(routes.customerRoutes.dashboard);
  }

  // fallback
  return redirect('/');
}
