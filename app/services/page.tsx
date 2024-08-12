import Image from 'next/image'

type Props = {}

const services = [
	{
		id: 1,
		title: 'Діагностика парогенератора',
		desc:
			'Проведення детальної діагностики вашого парогенератора для виявлення несправностей. Використовуємо сучасне обладнання для точного аналізу роботи пристрою.',
		conditions: 'Безкоштовна діагностика при подальшому ремонті.',
		src: `${process.env.PUBLIC_URL}/services/01.webp`,
	},
	{
		id: 2,
		title: 'Ремонт нагрівальних елементів',
		desc:
			'Відновлення та заміна нагрівальних елементів для забезпечення правильної роботи парогенератора. Гарантуємо якісні запчастини та професіоналізм.',
		conditions: 'Гарантія на виконані роботи 6 місяців.',
		src: `${process.env.PUBLIC_URL}/services/02.webp`,
	},
	{
		id: 3,
		title: 'Чистка та обслуговування',
		desc:
			'Комплексне чищення парогенератора, видалення накипу та забруднень. Регулярне обслуговування продовжує термін служби пристрою.',
		conditions: 'Спеціальна знижка при замовленні комплексного обслуговування.',
		src: `${process.env.PUBLIC_URL}/services/03.webp`,
	},
	{
		id: 4,
		title: 'Консультації та підтримка',
		desc:
			'Надання консультацій щодо експлуатації та обслуговування парогенераторів. Допоможемо вирішити будь-які питання та проблеми.',
		conditions: 'Безкоштовна онлайн-консультація',
		src: `${process.env.PUBLIC_URL}/services/04.webp`,
	},
]

interface ServiceCardProps {
	id: number
	title: string
	desc: string
	conditions: string
	src: string
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ id, title, desc, conditions, src }) => {
	return (
		<div className='flex flex-col items-center gap-y-12'>
			<Image className='w-40 h-40 rounded-full' src={src} alt={title} width={320} height={240} />
			<h3 className='text-xl font-bold'>{title}</h3>
			<p className='text-sm text-gray-600'>{desc}</p>
			<p className='text-sm text-gray-500'>{conditions}</p>
		</div>
	)
}

const ServicesPage = (props: Props) => {
	return (
		<div>
			<h2 className='text-4xl mb-4 flex justify-start items-start'>Послуги</h2>
			{services.map(service => (
				<ServiceCard key={service.id} {...service} />
			))}
		</div>
	)
}

export default ServicesPage
