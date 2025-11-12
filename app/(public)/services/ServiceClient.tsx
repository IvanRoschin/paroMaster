'use client';

import { Breadcrumbs } from '@/components';

import { ServiceCard } from './SeviceCard';

const services = [
  {
    id: 1,
    title: 'Діагностика парогенератора',
    desc: 'Проведення детальної діагностики вашого парогенератора для виявлення несправностей. Використовуємо сучасне обладнання для точного аналізу роботи пристрою.',
    conditions: 'Безкоштовна діагностика при подальшому ремонті.',
    src: `/services/01.webp`,
  },
  {
    id: 2,
    title: 'Ремонт нагрівальних елементів',
    desc: 'Відновлення та заміна нагрівальних елементів для забезпечення правильної роботи парогенератора. Гарантуємо якісні запчастини та професіоналізм.',
    conditions: 'Гарантія на виконані роботи 6 місяців.',
    src: `/services/02.webp`,
  },
  {
    id: 3,
    title: 'Чистка та обслуговування',
    desc: 'Комплексне чищення парогенератора, видалення накипу та забруднень. Регулярне обслуговування продовжує термін служби пристрою.',
    conditions: 'Спеціальна знижка при замовленні комплексного обслуговування.',
    src: `/services/03.webp`,
  },
  {
    id: 4,
    title: 'Консультації та підтримка',
    desc: 'Надання консультацій щодо експлуатації та обслуговування парогенераторів. Допоможемо вирішити будь-які питання та проблеми.',
    conditions: 'Безкоштовна онлайн-консультація',
    src: `/services/04.webp`,
  },
];

export default function ServicesPage() {
  return (
    <section className="max-w-6xl mx-auto py-3 container">
      <Breadcrumbs />
      <h1 className="subtitle mb-4 text-center">Послуги</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(service => (
          <div key={service.id}>
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </section>
  );
}
