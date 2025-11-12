import { generateMetadata } from '@/app/helpers/generateMetadata';
import WorksClient from './WorksClient';

export const metadata = generateMetadata({
  title: 'Наші роботи | ParoMaster',
  description:
    'Фото та опис виконаних робіт ParoMaster: ремонт плат керування, заміна бойлерів, оновлення підошов прасок та комунікацій. Професійний сервіс парогенераторів в Україні.',
  keywords: [
    'наші роботи ParoMaster',
    'ремонт парогенератора Laurastar',
    'ремонт плати керування',
    'заміна бойлера парогенератора',
    'переобладнання праски',
    'ремонт парогенератора Київ',
    'сервіс Laurastar Україна',
    'обслуговування парогенераторів',
  ],
  url: process.env.PUBLIC_URL,
  extra: {
    openGraph: {
      url: `${process.env.PUBLIC_URL}/works`,
      title: 'Наші роботи — приклади ремонту парогенераторів | ParoMaster',
      description:
        'Реальні фото та результати робіт ParoMaster: ремонт, заміна бойлерів, оновлення прасок. Професійне обслуговування Laurastar та інших брендів.',
    },
    alternates: {
      canonical: `${process.env.PUBLIC_URL}/works`,
    },
  },
  imageUrl: '/works/boiler-replacement.webp',
  imageAlt: 'Приклад виконаної роботи ParoMaster — заміна бойлера Laurastar',
});

export default function WorksPage() {
  return <WorksClient />;
}
