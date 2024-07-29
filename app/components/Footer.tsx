import Image from 'next/image'
import Logo from './Logo'
import Socials from './Socials'

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
			<div className='flex gap-8 mb-8'>
				<div className='w-[50%]  text-2xl flex flex-col gap-8'>
					Доставка
					<div className='border-b border-primaryAccentColor' />
					<Image
						src={'/delivery/Nova_Poshta.png'}
						alt='Нова пошта'
						width={150}
						height={100}
						className='w-full h-[80px] object-cover'
					/>
					<Image
						src={'/delivery/Meest.png'}
						alt='Meest'
						width={75}
						height={50}
						className='w-full h-[80px] object-cover'
					/>
				</div>
				<div className='w-[50%]  text-2xl flex flex-col gap-8'>
					Оплата
					<div className='border-b border-primaryAccentColor' />
					<Image
						src={'/payment/mastercard_white.svg'}
						alt='MasterCard'
						width={75}
						height={50}
						className='w-full h-[65px] object-cover'
					/>
					<Image
						src={'/payment/visa_white.svg'}
						alt='visa'
						width={75}
						height={80}
						className='w-[75px] h-[80px] object-contain'
					/>
				</div>
				<div>Contacts</div>
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
