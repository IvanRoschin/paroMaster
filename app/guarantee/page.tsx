import React from 'react'

type Props = {}

const GuaranteePage = (props: Props) => {
	return (
		<div>
			<h2 className='text-4xl mb-4 flex justify-start items-start'>Гарантія</h2>

			<section className='mb-6'>
				<h2 className='text-xl font-semibold mb-2'>Тривалість гарантії</h2>
				<p className='mb-2'>
					На всі комлектуючі до парогенераторів надається гарантія терміном на 2 місяці з моменту
					покупки.
				</p>
				<p className='mb-2'>
					На надані послуги з ремонту парогенераторів надається гарантія терміном на 15 календарних
					днів з дня отримання послуги.
				</p>
				<p className='mb-2'>
					Гарантія покриває виробничі дефекти та несправності, які виникають внаслідок нормального
					використання товару.
				</p>
			</section>

			<section className='mb-6'>
				<h2 className='text-xl font-semibold mb-2'>Умови гарантії</h2>
				<ul className='list-disc pl-5'>
					<li className='mb-1'>
						Гарантія не покриває шкоди, завданої внаслідок неналежного використання або
						несанкціонованих ремонтів.
					</li>
					<li className='mb-1'>
						Для отримання гарантійного обслуговування, будь ласка, зберігайте підтвердження оплати.
					</li>
					<li className='mb-1'>
						У разі дефекту, зв'яжіться з нами для отримання подальших інструкцій.
					</li>
				</ul>
			</section>

			<section>
				<h2 className='text-xl font-semibold mb-2'>Як скористатися гарантією</h2>
				<ol className='list-decimal pl-5 mb-2'>
					<li className='mb-1'>Зберігайте документ, що підтверджує покупку (чек або накладну).</li>
					<li className='mb-1'>Зв'яжіться з нами через електронну пошту або телефон.</li>
					<li className='mb-1'>
						Надайте деталі про дефект та прикріпіть фото товару, якщо можливо.
					</li>
					<li className='mb-1'>Дотримуйтесь отриманих інструкцій для повернення або обміну.</li>
				</ol>
			</section>

			<section className='mt-4'>
				<h2 className='text-xl font-semibold mb-2'>Контактна інформація</h2>
				<p className='mb-2'>
					Якщо у вас виникли питання щодо гарантії або потребуєте допомоги, зв'яжіться з нами:
				</p>
				<p className='mb-1'>
					<strong>Телефон:</strong> {process.env.ADMIN_PHONE}
				</p>
				<p className='mb-1'>
					<strong>Електронна пошта:</strong> {process.env.ADMIN_EMAIL}
				</p>
			</section>
		</div>
	)
}

export default GuaranteePage
