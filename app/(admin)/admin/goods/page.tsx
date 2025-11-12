import { getServerSession } from 'next-auth';

import { CatalogPage } from '@/app/components';
import { authOptions } from '@/app/config/authOptions';
import { ISearchParams } from '@/types/index';
import { UserRole } from '@/types/IUser';

interface AdminGoodsPageProps {
  searchParams: Promise<ISearchParams>;
}

export default async function AdminGoodsPage({
  searchParams,
}: AdminGoodsPageProps) {
  const params = await searchParams;

  const session = await getServerSession(authOptions);
  const role = session?.user?.role
    ? (session.user.role as UserRole)
    : UserRole.GUEST;

  return <CatalogPage searchParams={Promise.resolve(params)} role={role} />;
}
