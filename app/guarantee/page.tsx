import Link from 'next/link'

type Props = {}

const GuaranteePage = (props: Props) => {
	return (
		<div className='container mx-auto p-8'>
			<h2 className='title mb-1'>Гарантія</h2>
			<section className='mb-8'>
				<h3 className='subtitle'>Тривалість гарантії</h3>
				<p className='text-lg text-gray-700 mb-4'>
					На всі комплектуючі до парогенераторів надається гарантія терміном на 2 місяці з моменту
					покупки.
				</p>
				<p className='text-lg text-gray-700 mb-4'>
					На надані послуги з ремонту парогенераторів надається гарантія терміном на 15 календарних
					днів з дня отримання послуги.
				</p>
				<p className='text-lg text-gray-700'>
					Гарантія покриває виробничі дефекти та несправності, які виникають внаслідок нормального
					використання товару.
				</p>
			</section>

			<section className='mb-8'>
				<h3 className='subtitle'>Умови гарантії</h3>
				<ul className='list-disc pl-5 space-y-2 text-lg text-gray-700'>
					<li>
						Гарантія не покриває шкоди, завданої внаслідок неналежного використання або
						несанкціонованих ремонтів.
					</li>
					<li>
						Для отримання гарантійного обслуговування, будь ласка, зберігайте підтвердження оплати.
					</li>
					<li>У разі дефекту, зв&apos;яжіться з нами для отримання подальших інструкцій.</li>
				</ul>
			</section>

			<section className='mb-8'>
				<h3 className='subtitle'>Як скористатися гарантією</h3>
				<ol className='list-decimal pl-5 space-y-2 text-lg text-gray-700'>
					<li>Зберігайте документ, що підтверджує покупку (чек або накладну).</li>
					<li>Зв&apos;яжіться з нами через електронну пошту або телефон.</li>
					<li>Надайте деталі про дефект та прикріпіть фото товару, якщо можливо.</li>
					<li>Дотримуйтесь отриманих інструкцій для повернення або обміну.</li>
				</ol>
			</section>

			<section className='m-8'>
				<h3 className='subtitle'>Контактна інформація</h3>
				<p className='text-lg text-gray-700 mb-4'>
					Якщо у вас виникли питання щодо гарантії або потребуєте допомоги, зв&apos;яжіться з нами:
				</p>
				<p className='text-lg text-gray-700 mb-2'>
					<strong>Телефон:</strong>{' '}
					<Link
						href={`tel:${process.env.ADMIN_PHONE}`}
						className='text-primaryAccentColor underline'
					>
						{process.env.ADMIN_PHONE}
					</Link>
				</p>
				<p className='text-lg text-gray-700'>
					<strong>Електронна пошта:</strong>{' '}
					<Link
						href={`mailto:${process.env.ADMIN_EMAIL}`}
						className='text-primaryAccentColor underline'
					>
						{process.env.ADMIN_EMAIL}
					</Link>
				</p>
			</section>
		</div>
	)
}

export default GuaranteePage
