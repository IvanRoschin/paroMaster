import Logo from '@/components/Logo'
import Link from 'next/link'

const PrivacyPolicy = () => {
	const color = false // Define dynamically if needed
	const contactColorClass = color ? 'text-black' : 'text-white'

	return (
		<div className='bg-white text-black p-6'>
			<h1 className='text-center text-2xl font-bold mb-8'>
				ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ ІНТЕРНЕТ-МАГАЗИНУ
			</h1>
			<div className='text-center mb-8'>
				<Logo />
			</div>

			<Section title='§ 1 ОСНОВНІ ПОЛОЖЕННЯ'>
				<p className='mb-2'>
					1. Адміністратором персональних даних, зібраних через інтернет-магазин paromaster.com, є
					фізична особа – підприємець <strong>{process.env.ADMIN_NAME}</strong>, зареєстрований у
					Реєстрі юридичних осіб та фізичних осіб - підприємців запис № {process.env.ADMIN_REGON}.
				</p>
				<p className='mb-2'>
					<strong>Юридична адреса:</strong> {process.env.ADMIN_ADDRESS}
				</p>
				<p className='mb-2'>
					<strong>Електронна пошта:</strong>{' '}
					<a
						href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`}
						className='hover:text-primaryAccentColor'
					>
						{process.env.NEXT_PUBLIC_ADMIN_EMAIL}
					</a>
				</p>
				<p className='mb-2 flex items-start'>
					<strong>Номер телефону:</strong>{' '}
					<Link
						href={`tel:${process.env.NEXT_PUBLIC_ADMIN_PHONE}`}
						target='_blank'
						rel='noopener noreferrer'
						className={`ml-2 hover:text-primaryAccentColor`}
					>
						{process.env.NEXT_PUBLIC_ADMIN_PHONE}
					</Link>
				</p>
			</Section>

			<Section title='§ 2 ТИПИ ОБРОБЛЮВАНИХ ПЕРСОНАЛЬНИХ ДАНИХ, ЦІЛІ ТА ОБСЯГ ЗБОРУ ДАНИХ'>
				<p className='mb-2'>
					<strong>Ціль обробки і правова основа:</strong> Адміністратор обробляє персональні дані
					Користувачів інтернет-магазину <strong>{process.env.NEXT_PUBLIC_SITE_NAME}</strong> у
					таких випадках:
				</p>
				<List
					items={[
						'при реєстрації Облікового запису в Магазині для створення та управління персональним обліковим записом;',
						'при розміщенні Замовлення в Магазині для виконання договору купівлі-продажу;',
						'при підписці на розсилку для отримання комерційних повідомлень в електронному вигляді;',
						"при використанні Системи відгуків для отримання зворотного зв'язку від Клієнта;",
						'при використанні контактної форми для відправки повідомлення Адміністратору.',
					]}
				/>
				<p className='mb-2'>
					<strong>Види оброблюваних персональних даних:</strong> Користувач надає таку персональну
					інформацію:
				</p>
				<List
					items={[
						"Для облікового запису: ім'я, прізвище, ім'я користувача, адреса, адреса електронної пошти.",
						"Для замовлень: ім'я, прізвище, адреса, адреса електронної пошти, номер телефону.",
						"Для розсилки новин: ім'я, прізвище, адреса електронної пошти.",
						"Для системи відгуків: ім'я, прізвище.",
						"Для контактної форми: ім'я, адреса електронної пошти.",
					]}
				/>
			</Section>

			<Section title='§ 3 ПЕРЕДАЧА ПЕРСОНАЛЬНИХ ДАНИХ'>
				<p className='mb-2'>
					Персональні дані можуть бути передані наступним категоріям одержувачів:
				</p>
				<List
					items={[
						"транспортним компаніям та кур'єрським службам для доставки Замовлень;",
						'платіжним системам, обраним Користувачем при оформленні Замовлення;',
						"суб'єктам, що надають юридичні та бухгалтерські послуги для Адміністратора;",
						'органам влади, якщо це вимагається чинним законодавством.',
					]}
				/>
			</Section>
		</div>
	)
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
	<section className='mb-8'>
		<h3 className='text-lg font-semibold mb-2'>{title}</h3>
		{children}
	</section>
)

const List: React.FC<{ items: string[] }> = ({ items }) => (
	<ul className='list-disc list-inside mb-2'>
		{items.map((item, index) => (
			<li key={index}>{item}</li>
		))}
	</ul>
)

export default PrivacyPolicy
