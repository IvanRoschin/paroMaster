"use client"

import Image from "next/image"
import Link from "next/link"

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

// interface ServiceCardProps {
//   id: number
//   title: string
//   desc: string
//   conditions: string
//   src: string
// }

// export const ServiceCard: React.FC<ServiceCardProps> = ({ id, title, desc, conditions, src }) => {
//   return (
//     <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
//       <div className="relative overflow-hidden group">
//         <Image
//           src={src}
//           alt={title}
//           width={600}
//           height={400}
//           className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
//         />
//       </div>
//       <div className="p-4 flex flex-col gap-2">
//         <h2 className="subtitle">{title}</h2>
//         <p className="text-gray-600">{desc}</p>
//         <Link
//           href="#contactForm"
//           className="relative inline-block text-sm text-gray-500 italic pt-2 hover:text-gray-800"
//         >
//           {conditions}
//           <span className="absolute h-[3px] w-0 left-0 -bottom-1 rounded-xl bg-orange-600 transition-all duration-300 hover:w-full"></span>
//         </Link>
//       </div>
//     </div>
//   )
// }

const ServicesPage = () => {
  return (
    <section className="max-w-6xl mx-auto py-3 container">
      <h1 className="subtitle mb-4 text-center">Послуги</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(service => (
          <div key={service.id} className="rounded-2xl overflow-hidden shadow-lg bg-white">
            <div className="relative overflow-hidden group">
              <Image
                src={service.src}
                alt={service.title}
                width={600}
                height={400}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h2 className="subtitle">{service.title}</h2>
              <p className="text-gray-600">{service.desc}</p>
              <Link
                href="#contactForm"
                className="relative inline-block text-sm text-gray-500 italic pt-2 hover:text-gray-800"
              >
                {service.conditions}
                <span className="absolute h-[3px] w-0 left-0 -bottom-1 rounded-xl bg-orange-600 transition-all duration-300 hover:w-full"></span>
              </Link>
            </div>
          </div>
          // <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </section>
  )
}

export default ServicesPage
