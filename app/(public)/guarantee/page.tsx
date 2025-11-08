import Link from 'next/link';

import { generateMetadata } from '@/app/helpers/generateMetadata';
import { Breadcrumbs } from '@/components';

export const metadata = generateMetadata({
  title: 'Гарантія | ParoMaster',
  description:
    'Детальні умови гарантії на товари та послуги ParoMaster. Гарантія на комплектуючі — 2 місяці, на ремонт — 15 днів. Як скористатися гарантією та отримати підтримку.',
  keywords: [
    'гарантія ParoMaster',
    'гарантія на ремонт парогенератора',
    'умови гарантії',
    'гарантійне обслуговування',
    'повернення товару ParoMaster',
    'сервіс Laurastar Україна',
    'ремонт парогенераторів гарантія',
    'підтримка клієнтів ParoMaster',
  ],
  url: process.env.PUBLIC_URL,
  extra: {
    openGraph: {
      url: `${process.env.PUBLIC_URL}/guarantee`,
      title: 'Гарантія на товари та послуги | ParoMaster',
      description:
        'Дізнайтесь про гарантію ParoMaster: 2 місяці на комплектуючі, 15 днів на ремонт. Як оформити гарантійне звернення та отримати сервісну підтримку.',
    },
    alternates: {
      canonical: `${process.env.PUBLIC_URL}/guarantee`,
    },
  },
  imageUrl: '/services/04.webp',
  imageAlt:
    'Гарантія ParoMaster — підтримка клієнтів та сервісне обслуговування',
});

const GuaranteePage = () => {
  return (
    <div className="max-w-6xl mx-auto py-3 container">
      <Breadcrumbs />

      <h2 className="subtitle mb-4 text-center">Гарантія</h2>

      <section className="mb-8 border-b border-gray-200 pb-6">
        <h3 className="subtitle">Тривалість гарантії</h3>
        <p className="text-lg text-gray-700 mb-4">
          На всі комплектуючі до парогенераторів надається гарантія терміном на
          <strong> 2 місяці</strong> з моменту покупки.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          На надані послуги з ремонту парогенераторів діє гарантія
          <strong> 15 календарних днів</strong> з дня отримання послуги.
        </p>
        <p className="text-lg text-gray-700">
          Гарантія поширюється на виробничі дефекти та несправності, що виникли
          під час нормального використання товару.
        </p>
      </section>

      <section className="mb-8 border-b border-gray-200 pb-6">
        <h3 className="subtitle">Умови гарантії</h3>
        <ul className="list-disc pl-5 space-y-2 text-lg text-gray-700">
          <li>
            Гарантія не покриває шкоди, завданої внаслідок неналежного
            використання або несанкціонованого ремонту.
          </li>
          <li>
            Для отримання гарантійного обслуговування, будь ласка, зберігайте
            підтвердження оплати.
          </li>
          <li>
            У разі виявлення дефекту, зв&apos;яжіться з нами для подальших
            інструкцій.
          </li>
        </ul>
      </section>

      <section className="mb-8 border-b border-gray-200 pb-6">
        <h3 className="subtitle">Як скористатися гарантією</h3>
        <ol className="list-decimal pl-5 space-y-2 text-lg text-gray-700">
          <li>
            Зберігайте документ, що підтверджує покупку (чек або накладну).
          </li>
          <li>Зв&apos;яжіться з нами через електронну пошту або телефон.</li>
          <li>
            Надайте деталі про дефект та, за можливості, прикріпіть фото товару.
          </li>
          <li>Дотримуйтесь подальших інструкцій для повернення або обміну.</li>
        </ol>
      </section>

      <section className="mt-8">
        <h3 className="subtitle">Контактна інформація</h3>
        <p className="text-lg text-gray-700 mb-4">
          Якщо у вас виникли питання щодо гарантії або потрібна допомога —
          зв&apos;яжіться з нами:
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <strong>Телефон:</strong>{' '}
          <Link
            href={`tel:${process.env.NEXT_PUBLIC_ADMIN_PHONE}`}
            className="text-primaryAccentColor underline"
          >
            {process.env.NEXT_PUBLIC_ADMIN_PHONE}
          </Link>
        </p>
        <p className="text-lg text-gray-700">
          <strong>Електронна пошта:</strong>{' '}
          <Link
            href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`}
            className="text-primaryAccentColor underline"
          >
            {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
          </Link>
        </p>
      </section>
    </div>
  );
};

export default GuaranteePage;
