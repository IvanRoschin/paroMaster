"use client"

import { ServiceCard } from "./SeviceCard"

const services = [
  {
    id: 1,
    title: "Діагностика парогенератора",
    desc: "Проведення детальної діагностики вашого парогенератора для виявлення несправностей. Використовуємо сучасне обладнання для точного аналізу роботи пристрою.",
    conditions: "Безкоштовна діагностика при подальшому ремонті.",
    src: `/services/01.webp`
  },
  {
    id: 2,
    title: "Ремонт нагрівальних елементів",
    desc: "Відновлення та заміна нагрівальних елементів для забезпечення правильної роботи парогенератора. Гарантуємо якісні запчастини та професіоналізм.",
    conditions: "Гарантія на виконані роботи 6 місяців.",
    src: `/services/02.webp`
  },
  {
    id: 3,
    title: "Чистка та обслуговування",
    desc: "Комплексне чищення парогенератора, видалення накипу та забруднень. Регулярне обслуговування продовжує термін служби пристрою.",
    conditions: "Спеціальна знижка при замовленні комплексного обслуговування.",
    src: `/services/03.webp`
  },
  {
    id: 4,
    title: "Консультації та підтримка",
    desc: "Надання консультацій щодо експлуатації та обслуговування парогенераторів. Допоможемо вирішити будь-які питання та проблеми.",
    conditions: "Безкоштовна онлайн-консультація",
    src: `/services/04.webp`
  }
]

interface ServiceCardProps {
  id: number
  title: string
  desc: string
  conditions: string
  src: string
}

// export const ServiceCard: React.FC<ServiceCardProps> = ({ id, title, desc, conditions, src }) => {
// 	return (
// 		<div className='flex flex-col items-center p-6 bg-white rounded-lg shadow-md min-h-full'>
// 			<Image className='w-80 h-60 rounded-lg mb-4' src={src} alt={title} width={320} height={240} />
// 			<h3 className='subtitle'>{title}</h3>
// 			<p className='text-sm text-gray-700 text-center mb-4 leading-relaxed flex-grow'>{desc}</p>
// 			<p className='text-sm text-gray-500 text-center italic border-t pt-2'>{conditions}</p>
// 		</div>
// 	)
// }

const ServicesPage = () => {
  return (
    <div className="container mx-auto p-8">
      <h2 className="title mb-1">Послуги</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`${
              index % 2 === 0 ? "md:row-start-1" : "md:row-start-2"
            } md:col-start-${(index % 2) + 1} flex`}
          >
            <ServiceCard {...service} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ServicesPage
