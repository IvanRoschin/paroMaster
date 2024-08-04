import { addNewLid } from '@/actions/lids'
import Image from 'next/image'
import AddLidForm from './AddLidForm'
import Logo from './Logo'
import Socials from './Socials'

interface FormValues {
	name: string
	email: string
	phone: string
}

// const footerMenu = {[
// 	{ menuItemName: 'Послуги', menuItemLink: '/ ' },
// 	{ menuItemName: 'Доставка та оплата', menuItemLink: '/ ' },
// 	{ menuItemName: 'Гарантія', menuItemLink: '/ ' },
// 	{ menuItemName: 'Контакти', menuItemLink: '/ ' },
// ]}

const Footer = () => {
	return (
		<div className='bg-slate-800  p-8 text-white'>
			<div className='flex justify-between mb-10'>
				<Logo color='white' />
				<Socials color='white' />
			</div>
			<div className='flex justify-between'>
				<div className='mb-10'>
					<div className='flex gap-8 mb-20'>
						<div className='w-[50%] text-2xl flex flex-col gap-8'>
							Доставка
							<div className='border-b border-primaryAccentColor ' />
							<div className='flex justify-between'>
								<Image
									src={'/delivery/nova_poshta_white.svg'}
									alt='Нова пошта'
									width={120}
									height={30}
									className='h-[30px] object-fit'
								/>
								<Image
									src={'/delivery/ukr_poshta_white.svg'}
									alt='Ukrposhta'
									width={120}
									height={30}
									className='h-[30px] object-fit'
								/>
							</div>
						</div>
						<div className='w-[50%] text-2xl flex flex-col gap-8'>
							Оплата
							<div className='border-b border-primaryAccentColor' />
							<div className='flex justify-between'>
								<Image
									src={'/payment/mastercard_white.svg'}
									alt='MasterCard'
									width={120}
									height={30}
									className='h-[30px] object-fit'
								/>
								<Image
									src={'/payment/visa_white.svg'}
									alt='visa'
									width={120}
									height={30}
									className='h-[30px] object-fit'
								/>
							</div>
						</div>
					</div>
					<div className='flex gap-8 mb-4 '>
						<div className='w-[33%] text-2xl flex flex-col gap-8'>
							Інформація
							<div className='border-b border-primaryAccentColor ' />
						</div>
						<div className='w-[33%] text-2xl flex flex-col gap-8'>
							Продукція <div className='border-b border-primaryAccentColor ' />
						</div>
						<div className='w-[33%] text-2xl flex flex-col gap-8'>
							Категорії <div className='border-b border-primaryAccentColor ' />
						</div>
					</div>
				</div>
				<div>
					<AddLidForm action={addNewLid} title='Замовити зворотній дзвінок' />
				</div>
			</div>
			<div>
				Footer menu
				<ul>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
				</ul>
			</div>
			Footer
		</div>
	)
}

export default Footer
