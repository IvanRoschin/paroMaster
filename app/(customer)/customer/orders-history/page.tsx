import { getServerSession } from 'next-auth';

import {
  getCustomerByUserAction,
  getOrderByIdAction,
  getUserByIdAction,
} from '@/app/actions';
import { authOptions } from '@/app/config/authOptions';
import { ICustomer } from '@/types/ICustomer';
import { IOrder } from '@/types/IOrder';
import { IUser } from '@/types/IUser';
import OrdersHistoryClient from './OrdersHistoryClient';

export default async function OrdersHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return <OrdersHistoryClient orders={[]} />;

  const user: IUser | undefined =
    (await getUserByIdAction(session.user.id)) || undefined;

  const customer: ICustomer | undefined = user?._id
    ? ((await getCustomerByUserAction(user._id)) ?? undefined)
    : undefined;

  const orders = customer?.orders
    ? await Promise.all(
        customer.orders.map(favId => getOrderByIdAction(favId.toString()))
      )
    : [];

  const filteredOrders: IOrder[] = orders.filter(
    (g): g is IOrder => g !== null
  );

  return <OrdersHistoryClient orders={filteredOrders} />;
}
