import React from 'react'

type Props = {}

const DeliveryPage = (props: Props) => {
	return (
		<div>
			<h2 className='text-4xl mb-4 flex justify-start items-start'>Оплата та Доставка</h2>

			<section className='mb-6'>
				<h2 className='text-xl font-semibold mb-2'>Оплата</h2>
				<ul className='list-disc pl-5'>
					<li className='mb-1'>
						Безготівковий розрахунок: Здійсніть оплату через банківський переказ або платіжні
						системи.
					</li>
					<li className='mb-1'>
						Передплата: Можлива оплата замовлення повністю або частково перед відправкою.
					</li>
					<li className='mb-1'>
						Оплата при отриманні: Оплатіть ваше замовлення на відділенні Нової Пошти.
					</li>
				</ul>
			</section>

			<section>
				<h2 className='text-xl font-semibold mb-2'>Доставка</h2>
				<p className='mb-2'>Доставка здійснюється надійними операторами:</p>
				<ul className='list-disc pl-5 mb-2'>
					<li className='mb-1'>Укрпошта</li>
					<li className='mb-1'>Нова Пошта</li>
				</ul>
				<p>
					При замовленні на суму більше <strong>1000 грн</strong> доставка буде безкоштовною.
				</p>
			</section>

			<section className='mt-4'>
				<h2 className='text-xl font-semibold mb-2'>Як оформити замовлення</h2>
				<ol className='list-decimal pl-5'>
					<li className='mb-1'>Оберіть товари, які вас цікавлять, та додайте їх у кошик.</li>
					<li className='mb-1'>
						Перейдіть до оформлення замовлення, вибравши зручний вам спосіб оплати.
					</li>
					<li className='mb-1'>Вкажіть адресу доставки.</li>
					<li className='mb-1'>
						Підтвердіть замовлення, і ми відправимо його вам у найкоротші терміни!
					</li>
				</ol>
			</section>
		</div>
	)
}

export default DeliveryPage
