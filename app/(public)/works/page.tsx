import Image from 'next/image';

import Breadcrumbs from '@/components/common/Breadcrumbs';

const works = [
  {
    id: 1,
    title: 'Ремонт плати керування',
    src: '/works/control-board-repair.webp',
    desc: 'Професійне відновлення плати керування парогенератора Laurastar.',
  },
  {
    id: 2,
    title: 'Заміна бойлера',
    src: '/works/boiler-replacement.webp',
    desc: 'Виконано повну заміну бойлера з тестуванням на герметичність.',
  },
  {
    id: 3,
    title: 'Переобладнання підошви праски',
    src: `/works/iron-soleplate.webp`,
    desc: 'Оновлення підошви для ідеального ковзання по тканині.',
  },
  {
    id: 4,
    title: 'Заміна проводки та шлангів',
    src: `/works/wiring-replacement.webp`,
    desc: 'Безпечно і акуратно замінено елементи комунікацій.',
  },
];

const OurworkPage = () => {
  return (
    <section className="max-w-6xl mx-auto py-3 container">
      <Breadcrumbs />

      <h1 className="subtitle mb-4 text-center">Наші роботи</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {works.map(work => (
          <div
            key={work.id}
            className="rounded-2xl overflow-hidden shadow-lg bg-white"
          >
            <div className="relative overflow-hidden group">
              <Image
                src={work.src}
                alt={work.title}
                width={600}
                height={400}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h2 className="subtitle">{work.title}</h2>
              <p className="text-gray-600">{work.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurworkPage;
