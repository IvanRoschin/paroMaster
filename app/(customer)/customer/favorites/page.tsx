import { getServerSession } from 'next-auth';

import {
  getCustomerByUserAction,
  getGoodByIdAction,
  getUserByIdAction,
} from '@/app/actions';
import { authOptions } from '@/app/config/authOptions';
import { ICustomer } from '@/types/ICustomer';
import { IGoodUI } from '@/types/IGood';
import { IUser } from '@/types/IUser';
import FavoritesClient from './FavoritesClient';

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return <FavoritesClient goods={[]} />;

  const user: IUser | undefined =
    (await getUserByIdAction(session.user.id)) || undefined;

  const customer: ICustomer | undefined = user?._id
    ? ((await getCustomerByUserAction(user._id)) ?? undefined)
    : undefined;

  console.log('customer', customer);

  const goods = customer?.favorites
    ? await Promise.all(
        customer.favorites.map(favId => getGoodByIdAction(favId.toString()))
      )
    : [];

  const filteredGoods: IGoodUI[] = goods.filter(
    (g): g is IGoodUI => g !== null
  );

  return <FavoritesClient goods={filteredGoods} />;
}
