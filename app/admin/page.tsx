'use client'

import Card from '@/components/admin/Card'
import PopUp from '@/components/admin/PopUp'
import Button from '@/components/Button'
import React, { useState } from 'react'
import { IconType } from 'react-icons'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { FiPackage } from 'react-icons/fi'
import { RiAdminLine } from 'react-icons/ri'
import { SiTestinglibrary } from 'react-icons/si'

interface CardData {
	title: string
	count: number
	link: string
	icon: IconType
}

const cardData: CardData[] = [
	{
		title: 'Адміністратори',
		count: 10,
		link: 'admin/users',
		icon: RiAdminLine,
	},
	{
		title: 'Клієнти',
		count: 323,
		link: 'admin/goods',
		icon: FaUser,
	},
	{
		title: 'Замовлення',
		count: 32,
		link: 'admin/orders',
		icon: FaShoppingCart,
	},
	{
		title: 'Товари',
		count: 323,
		link: 'admin/goods',
		icon: FiPackage,
	},
	{
		title: 'Категорії',
		count: 323,
		link: 'admin/categories',
		icon: FiPackage,
	},
	{
		title: 'Відгуки',
		count: 323,
		link: 'admin/testimonials',
		icon: SiTestinglibrary,
	},
]

const Admin: React.FC = () => {
	const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false)
	const [popUpMessage, setPopUpMessage] = useState<string>('')

	const handleClick = (response: 'yes' | 'no') => {
		const message =
			response === 'yes' ? 'Це круто 👍 погнали 🏍️' : 'Не обманюйся 🤨, я бачу, що готовий'

		setPopUpMessage(message)
		setIsPopUpOpen(true)
	}

	const closePopUp = () => {
		setIsPopUpOpen(false)
	}

	return (
		<div>
			<div className='flex justify-center items-center mt-10'>
				<h3 className='text-primaryAccentColor text-2xl uppercase'>
					<p className='mb-5'>Адмін, ти готовий?</p>
					<div className='flex gap-3 justify-center items-center'>
						<Button label='Так' type='bottom' small onClick={() => handleClick('yes')} />
						<Button label='Ні' type='bottom' small outline onClick={() => handleClick('no')} />
					</div>
				</h3>
			</div>

			<div className='flex items-center justify-center m-4'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					{cardData.map((data, index) => (
						<Card
							key={index}
							title={data.title}
							count={data.count}
							icon={data.icon}
							link={data.link}
						/>
					))}
				</div>
			</div>

			{isPopUpOpen && <PopUp message={popUpMessage} onClose={closePopUp} />}
		</div>
	)
}

export default Admin
