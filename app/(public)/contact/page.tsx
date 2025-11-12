import { generateMetadata } from '@/app/helpers/generateMetadata';
import ContactClient from './ContactClient';

export const metadata = generateMetadata({
  title: 'Контакти | ParoMaster',
  description:
    'Звʼяжіться з ParoMaster — сервіс та продаж парогенераторів Laurastar в Україні. Телефон, адреса, години роботи, карта Google, форма зворотного зв’язку.',
  keywords: [
    'контакти ParoMaster',
    'сервіс Philips Україна',
    'ремонт парогенераторів контакти',
    'адреса ParoMaster',
    'форма зворотного зв’язку',
    'телефон ParoMaster',
    'графік роботи ParoMaster',
    'Google карта ParoMaster',
  ],
  url: process.env.PUBLIC_URL,
  extra: {
    openGraph: {
      url: `${process.env.PUBLIC_URL}/contacts`,
      title: 'Контакти ParoMaster | Сервіс Laurastar та продаж парогенераторів',
      description:
        'Контактна інформація ParoMaster: телефон, адреса, години роботи. Подивіться нас на Google карті або залиште заявку на зворотний дзвінок.',
    },
    alternates: {
      canonical: `${process.env.PUBLIC_URL}/contacts`,
    },
  },
  imageUrl: '/services/05.webp',
  imageAlt: 'Контакти ParoMaster — сервісний центр Laurastar в Україні',
});

export default async function ContactPage() {
  return <ContactClient />;
}
