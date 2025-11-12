import { Metadata } from 'next';
import Link from 'next/link';

import { generateMetadata } from '@/app/helpers/generateMetadata';

export const metadata: Metadata = generateMetadata({
  title: 'Публічна оферта | ParoMaster',
  description:
    'Публічна оферта інтернет-магазину ParoMaster — умови купівлі, оплати, доставки та повернення товарів.',
  keywords: [
    'публічна оферта',
    'ParoMaster',
    'умови купівлі',
    'оплата',
    'доставка',
    'повернення товарів',
  ],
  url: `${process.env.PUBLIC_URL}/publicoffer`,
  imageUrl: '/services/01.webp',
  imageAlt: 'Публічна оферта ParoMaster',
});

const PublicOfferSummary = () => {
  return (
    <div className="bg-gray-100 p-4 text-sm rounded">
      <p className="mb-2">
        Оформлюючи замовлення, ви погоджуєтесь з умовами{' '}
        <Link
          href="/publicoffer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primaryAccentColor underline hover:no-underline"
        >
          Публічної оферти
        </Link>
        .
      </p>
      <p>
        Основні умови: товар передається після повної оплати, доставка — обраною
        службою, повернення — упродовж 14 днів.
      </p>
    </div>
  );
};

export default PublicOfferSummary;
