import { getServerSession } from 'next-auth';

import { getCustomerByUserAction } from '@/app/actions/customers';
import { getUserByIdAction } from '@/app/actions/users';
import { authOptions } from '@/app/config/authOptions';
import { ICustomer } from '@/types/ICustomer';
import { IUser } from '@/types/IUser';

import ChangeDeliveryInfoClient from './ChangeDeliveryClient';

type Props = {};

export default async function changeDeliveryInfoPage(props: Props) {
  const session = await getServerSession(authOptions);
  let user: IUser | undefined = undefined;
  let customer: ICustomer | undefined = undefined;
  if (session?.user?._id) {
    user = (await getUserByIdAction(session.user._id)) || undefined;
    if (user?._id) {
      customer = await getCustomerByUserAction(user._id);
    }
  }
  return <ChangeDeliveryInfoClient customer={customer} />;
}
