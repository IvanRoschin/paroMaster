// app/(public)/order/page.tsx

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/config/authOptions';
import { generateMetadata } from '@/app/helpers/generateMetadata';

import CheckoutClient from './checkoutClient';

export const metadata = generateMetadata({
  title: 'Оформлення замовлення | ParoMaster',
  description:
    'Оформіть замовлення на запчастини або ремонт парогенераторів ParoMaster швидко та зручно. Безпечна оплата, доставка по Україні.',
  keywords: [
    'замовлення ParoMaster',
    'оплата парогенераторів',
    'купити запчастини для парогенератора',
    'ремонт парогенераторів',
  ],
  imageUrl: '/services/01.webp',
  imageAlt: 'Оформлення замовлення ParoMaster',
});

export default async function Page() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  console.log('user:', user);

  return <CheckoutClient user={user} />;
}
