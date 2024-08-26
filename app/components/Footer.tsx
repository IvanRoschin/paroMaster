'use client'

import { getAllCategories } from '@/actions/categories'
import { addNewLid } from '@/actions/lids'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import AddLidForm from './AddLidForm'
import EmptyState from './EmptyState'
import Loader from './Loader'
import Logo from './Logo'
import Socials from './Socials'

const limit = 10

const env = process.env
env.PUBLIC_URL = env.PUBLIC_URL || ''

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

	const {
		data: categoriesData,
		isLoading: isCategorisLoading,
		isError: isCategoriesError,
	} = useQuery({
		queryKey: ['categories', searchParams],
		queryFn: () => getAllCategories(searchParams, limit),
	})

	const categories = categoriesData?.categories

	// Handle loading states
	if (isCategorisLoading) {
		return <Loader />
	}

	if (isCategoriesError) {
		return <div>Error fetching data.</div>
	}
	// Handle errors
	if (!categories?.length) {
		return <EmptyState showReset />
	}

	return (
		<div className='bg-slate-800 p-8 text-white'>
			<div className='flex justify-between mb-10'>
				<Logo color='white' />
				<Socials color='white' />
			</div>
			<div className='flex justify-between gap-10'>
				<div className='mb-10'>
					<div className='flex gap-8 mb-20'>
						<div className='w-[50%] text-2xl flex flex-col gap-8'>
							Доставка
							<div className='border-b border-primaryAccentColor' />
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
									alt='Visa'
									width={120}
									height={30}
									className='h-[30px] object-fit'
								/>
							</div>
						</div>
					</div>
					<div className='flex gap-8 mb-4'>
						<div className='w-[33%] text-2xl flex flex-col gap-8'>
							Інформація
							<div className='border-b border-primaryAccentColor' />
							<ul className='text-sm'>
								{[
									'Оплата та доставка',
									'Послуги та сервіси',
									'Гарантія',
									'Контакти',
									'Політика Конфіденційності',
								].map((text, index) => (
									<li
										key={index}
										className='nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200'
									>
										<Link href={`/${text.toLowerCase().replace(/ /g, '-')}`}>{text}</Link>
									</li>
								))}
							</ul>
						</div>
						<div className='w-[33%] text-2xl flex flex-col gap-8'>
							Товари
							<div className='border-b border-primaryAccentColor' />
							<ul className='text-sm'>
								{['Популярні', 'Акції та знижки'].map((text, index) => (
									<li
										key={index}
										className='nav mb-2 hover:transform hover:translate-x-2 transition-transform duration-200'
									>
										<Link href={`/${text.toLowerCase().replace(/ /g, '-')}`}>{text}</Link>
									</li>
								))}
							</ul>
						</div>
						<div className='w-[33%] text-2xl flex flex-col gap-8'>
							Категорії
							<div className='border-b border-primaryAccentColor' />
							<ul className='text-sm'>
								{categories?.map(({ src, title }, index) => (
									<li key={index} className='mb-3 nav'>
										<Link
											href={`/category/?${createQueryString('category', title)}`}
											className='flex justify-start items-start group'
										>
											<Image
												alt={title}
												src={src}
												width={20}
												height={20}
												className='w-5 h-5 mr-3 transition-filter duration-300 ease-in-out group-hover:filter-primary filter-white'
											/>
											{title}
										</Link>
									</li>
								))}
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
					Створюючи сьогодення, ми формуємо майбутнє разом.
				</p>
			</div>
		</div>
	)
}

export default Footer
