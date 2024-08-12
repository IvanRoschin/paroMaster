'use client'

import { addNewLid } from '@/actions/lids'
import { categoryList } from 'app/config/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import AddLidForm from './AddLidForm'
import { Icon } from './Icon'
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
	const searchParams = useSearchParams()

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString())
			if (value) {
				params.set(name, value)
			} else {
				params.delete(name)
			}
			return params.toString()
		},
		[searchParams],
	)
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
									src={`${process.env.PUBLIC_URL}/delivery/nova_poshta_white.svg`}
									alt='Нова пошта'
									width={120}
									height={30}
									className='h-[30px] object-fit'
								/>
								<Image
									src={`${process.env.PUBLIC_URL}/delivery/ukr_poshta_white.svg`}
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
									src={`${process.env.PUBLIC_URL}/payment/mastercard_white.svg`}
									alt='MasterCard'
									width={120}
									height={30}
									className='h-[30px] object-fit'
								/>
								<Image
									src={`${process.env.PUBLIC_URL}/payment/visa_white.svg`}
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
							<ul className='text-sm'>
								<li className='nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200'>
									{' '}
									<Link href='/delivery'>Оплата та доставка</Link>
								</li>
								<li className='nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200'>
									{' '}
									<Link href='/services'> Послуги та сервіси</Link>
								</li>
								<li className='nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200'>
									{' '}
									<Link href='/guarantee'>Гарантія</Link>
								</li>
								<li className='nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200'>
									{' '}
									<Link href='/contact'>Контакти</Link>
								</li>
								<li className='nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200'>
									{' '}
									<Link href='/guarantee'>Політика Конфіденційності</Link>
								</li>
							</ul>
						</div>
						<div className='w-[33%] text-2xl flex flex-col gap-8'>
							Товари <div className='border-b border-primaryAccentColor ' />
							<ul className='text-sm'>
								<li className='nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200'>
									<Link href='/special'>Популярні</Link>
								</li>
								<li className='nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200'>
									<Link href='/sales'>Акції та знижки</Link>
								</li>
							</ul>
						</div>
						<div className='w-[33%] text-2xl flex flex-col gap-8'>
							Категорії <div className='border-b border-primaryAccentColor ' />
							<ul className='text-sm'>
								{categoryList.map(({ icon, title }, index) => {
									return (
										<li
											key={index}
											className='mb-2 nav hover:transform hover:translate-x-2 transition-transform duration-200'
										>
											<Link
												href={`/category/?${createQueryString('category', title)}`}
												className='flex justify-start items-start'
											>
												<Icon name={icon} className='w-5 h-5  mr-3 text-white bg-transparent' />
												{title}
											</Link>
										</li>
									)
								})}
							</ul>
						</div>
					</div>
				</div>
				<div>
					<AddLidForm action={addNewLid} title='Замовити зворотній дзвінок' />
				</div>
			</div>
			<div className='border-b border-primaryAccentColor mb-5' />
			<div className='mb-5'>
				<p className='text-center'>
					&copy; 2024 Paro<span className='text-primaryAccentColor'>Master</span>. Усі права
					захищено. Створено з ❤️ та інноваціями.
					<br />
					<br />
					Створюючи сьогодення, ми формуємо майбутнє разом.{' '}
				</p>
			</div>
		</div>
	)
}

export default Footer
