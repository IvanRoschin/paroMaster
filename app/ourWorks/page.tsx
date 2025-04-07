import Image from "next/image"

type Props = {}

const works = [
  {
    title: "Ремонт плати керування",
    imgSrc: "/works/control-board-repair.webp",
    description: "Професійне відновлення плати керування парогенератора Laurastar."
  },
  {
    title: "Заміна бойлера",
    imgSrc: "/works/boiler-replacement.webp",
    description: "Виконано повну заміну бойлера з тестуванням на герметичність."
  },
  {
    title: "Переобладнання підошви праски",
    imgSrc: `/works/iron-soleplate.webp`,
    description: "Оновлення підошви для ідеального ковзання по тканині."
  },
  {
    title: "Заміна проводки та шлангів",
    imgSrc: `/works/wiring-replacement.webp`,
    description: "Безпечно і акуратно замінено елементи комунікацій."
  }
]

const page = (props: Props) => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl lg:text-5xl font-bold text-center mb-10">Наші роботи</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {works.map((work, index) => (
          <div key={index} className="rounded-2xl overflow-hidden shadow-lg bg-white">
            <div className="relative overflow-hidden group">
              <Image
                src={work.imgSrc}
                alt={work.title}
                width={600}
                height={400}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{work.title}</h2>
              <p className="text-gray-600">{work.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default page
