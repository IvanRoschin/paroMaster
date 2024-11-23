import Logo from '@/components/Logo'
import Link from 'next/link'

const PrivacyPolicyPage = (color: string) => {
	return (
		<div className='bg-white text-black p-6'>
			<h1 className='text-center text-2xl font-bold mb-8'>
				ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ ІНТЕРНЕТ-МАГАЗИНУ
			</h1>
			<span className='text-center mb-8'>
				<Logo />
			</span>

			<section className='mb-8'>
				<h3 className='text-lg font-semibold mb-2'>§ 1 ОСНОВНІ ПОЛОЖЕННЯ</h3>
				<p className='mb-2'>
					1. Адміністратором персональних даних, зібраних через інтернет-магазин paromaster.com, є
					фізична особа – підприємець
					<span className='font-semibold'> {process.env.ADMIN_NAME}</span>, зареєстрований у Реєстрі
					юридичних осіб та фізичних осіб - підприємців запис № {process.env.ADMIN_REGON} <br />
					<br />
					<span className='font-semibold'>юридична адреса: </span>
					{process.env.ADMIN_ADDRESS} <br /> <br />
					<span className='font-semibold'>адреса електронної пошти: </span>
					<a
						href={`mailto:${process.env.ADMIN_EMAIL}`}
						className='hover:text-primaryAccentColor nav '
					>
						{process.env.ADMIN_EMAIL}
					</a>
					<br /> <br />
					<span className='flex'>
						<span className='font-semibold'>номер телефону:</span>
						<Link
							href={`tel:${process.env.ADMIN_PHONE}`}
							target='_blank'
							rel='noopener noreferrer'
							className={`flex items-center justify-start hover:text-primaryAccentColor 
				${color ? 'text-black' : ' text-white'}
        `}
						>
							<span
								className={`nav hover:text-primaryAccentColor
				${color ? 'text-black' : ' text-white'}`}
							>
								{process.env.ADMIN_PHONE}
							</span>
						</Link>
					</span>{' '}
					<br /> іменований надалі «Адміністратор», а також «Постачальник».
				</p>
				<p className='mb-2'>
					2. Персональні дані, зібрані Адміністратором через веб-сайт, обробляються відповідно до
					Закону України «Про захист персональних даних», Регламентом (ЄС) 2016/679 Європейського
					парламенту та Ради від 27 квітня 2016 року про захист фізичних осіб при обробці
					персональних даних та про вільне переміщення таких даних, а також про скасування Директиви
					95/46/EC (Загальний регламент із захисту даних), відомий як RODO.
				</p>
				<p className='mb-2'>
					3. Будь-які слова і вирази, написані великими літерами в цій Політиці конфіденційності,
					слід розуміти відповідно до їх визначень, зазначених у Правилах інтернет-магазину
					paromaster.com.
				</p>
			</section>

			<section className='mb-8'>
				<h3 className='text-lg font-semibold mb-2'>
					§ 2 ТИПИ ОБРОБЛЮВАНИХ ПЕРСОНАЛЬНИХ ДАНИХ, ЦІЛІ ТА ОБСЯГ ЗБОРУ ДАНИХ
				</h3>
				<p className='mb-2'>
					1. <span className='font-semibold'>Ціль обробки і правова основа:</span> Адміністратор
					обробляє персональні дані Користувачів інтернет-магазину paromaster.com у таких випадках:
				</p>
				<ul className='list-disc list-inside mb-2'>
					<li>
						при реєстрації Облікового запису в Магазині для створення та управління персональним
						обліковим записом;
					</li>
					<li>при розміщенні Замовлення в Магазині для виконання договору купівлі-продажу;</li>
					<li>
						при підписці на розсилку для отримання комерційних повідомлень в електронному вигляді;
					</li>
					<li>
						при використанні Системи відгуків для отримання зворотного зв&apos;язку від Клієнта;
					</li>
					<li>при використанні контактної форми для відправки повідомлення Адміністратору.</li>
				</ul>
				<p className='mb-2'>
					2. <span className='font-semibold'>Види оброблюваних персональних даних:</span> Користувач
					надає таку персональну інформацію:
				</p>
				<ul className='list-disc list-inside mb-2'>
					<li>
						Для облікового запису: ім&apos;я, прізвище, ім&apos;я користувача, адреса, адреса
						електронної пошти.
					</li>
					<li>
						Для замовлень: ім&apos;я, прізвище, адреса, адреса електронної пошти, номер телефону.
					</li>
					<li>Для розсилки новин: ім&apos;я, прізвище, адреса електронної пошти.</li>
					<li>Для системи відгуків: ім&apos;я, прізвище.</li>
					<li>Для контактної форми: ім&apos;я, адреса електронної пошти.</li>
				</ul>
			</section>

			<section className='mb-8'>
				<h3 className='text-lg font-semibold mb-2'>§ 3 ПЕРЕДАЧА ПЕРСОНАЛЬНИХ ДАНИХ</h3>
				<p className='mb-2'>
					1. Персональні дані Користувачів можуть бути передані наступним категоріям одержувачів:
				</p>
				<ul className='list-disc list-inside mb-2'>
					<li>
						транспортним компаніям та кур&apos;єрським службам, які співпрацюють з Адміністратором
						для доставки Замовлень,
					</li>
					<li>платіжним системам, обраним Користувачем при оформленні Замовлення,</li>
					<li>суб&apos;єктам, що надають юридичні та бухгалтерські послуги для Адміністратора,</li>
					<li>органам влади, якщо це вимагається чинним законодавством.</li>
				</ul>
			</section>

			<section className='mb-8'>
				<h3 className='text-lg font-semibold mb-2'>§ 4 ПРАВА КОРИСТУВАЧІВ</h3>
				<p className='mb-2'>
					1. Користувачі мають право на доступ до своїх персональних даних, їх виправлення,
					видалення або обмеження обробки, а також право на переносимість даних.
				</p>
				<p className='mb-2'>
					2. У разі виявлення порушення прав користувачів, вони мають право подати скаргу до
					уповноваженого органу з питань захисту персональних даних.
				</p>
				<p className='mb-2'>
					3. Для реалізації своїх прав Користувачі можуть зв&apos;язатися з Адміністратором через
					контактну форму на веб-сайті або надіславши електронний лист за адресою:{' '}
					<a
						href={`mailto:${process.env.ADMIN_EMAIL}`}
						className='hover:text-primaryAccentColor nav '
					>
						{process.env.ADMIN_EMAIL}
					</a>
				</p>
			</section>

			<section className='mb-8'>
				<h3 className='text-lg font-semibold mb-2'>§ 5 ПОЛІТИКА (COOKIES)</h3>
				<p className='mb-2'>
					1. Інтернет-магазин paromaster.com використовує файли cookies, які зберігаються на
					пристрої користувача для забезпечення повного функціонування веб-сайту.
				</p>
				<p className='mb-2'>
					2. Користувачі можуть у будь-який час змінити налаштування свого браузера щодо файлів
					cookies.
				</p>
				<p className='mb-2'>
					3. Детальна інформація про файли cookies міститься в Політиці cookies, доступній на
					веб-сайті.
				</p>
			</section>

			<section className='mb-8'>
				<h3 className='text-lg font-semibold mb-2'>§ 6 ЗАКЛЮЧНІ ПОЛОЖЕННЯ</h3>
				<p className='mb-2'>
					1. Адміністратор залишає за собою право вносити зміни до цієї Політики конфіденційності.
				</p>
				<p className='mb-2'>2. Зміни вступають в силу з моменту їх публікації на веб-сайті.</p>
				<p className='mb-2'>
					3. Всі спірні питання вирішуються відповідно до чинного законодавства України.
				</p>
			</section>
		</div>
	)
}

export default PrivacyPolicyPage
