import { generateMetadata } from '@/app/helpers/generateMetadata';
import ServiceClient from './ServiceClient';

export const metadata = generateMetadata({
  title: 'Послуги з ремонту та обслуговування парогенераторів | ParoMaster',
  description:
    'ParoMaster надає послуги з діагностики, ремонту, чистки та обслуговування парогенераторів Laurastar та інших брендів. Професійний сервіс, гарантія якості та консультації фахівців.',
  keywords: [
    'ремонт парогенератора',
    'діагностика парогенератора',
    'чистка парогенератора',
    'сервіс Philips',
    'обслуговування парогенератора',
    'ремонт нагрівальних елементів',
    'сервіс парогенератора Київ',
    'ремонт прасок з парогенератором',
    'ParoMaster послуги',
  ],
  url: process.env.PUBLIC_URL,
  extra: {
    openGraph: {
      url: `${process.env.PUBLIC_URL}/services`,
      title: 'Послуги ParoMaster — ремонт, чистка та сервіс парогенераторів',
      description:
        'Професійні послуги ParoMaster: діагностика, ремонт нагрівальних елементів, чистка, технічне обслуговування та консультації. Гарантія якості та підтримка клієнтів.',
    },
    alternates: {
      canonical: `${process.env.PUBLIC_URL}/services`,
    },
  },
  imageUrl: '/services/03.webp',
  imageAlt: 'Послуги ParoMaster — обслуговування та ремонт парогенераторів',
});

export default function ServicesPage() {
  return <ServiceClient />;
}
