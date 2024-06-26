import Link from 'next/link'

// interface MenuItem {
// 	menuItemName: string
// 	menuItemLink: string
// }

// interface AdminMenuProps {
// 	menu: MenuItem[]
// }

const menu = [
	{ menuItemName: 'Замовлення', menuItemLink: '/ ' },
	{ menuItemName: 'Додати товар', menuItemLink: '/ ' },
	{ menuItemName: 'Видалити товар', menuItemLink: '/ ' },
	{ menuItemName: 'Редагувати товар', menuItemLink: '/ ' },
]

const AdminMenu = () => {
	return (
		<div className='pt-0 mr-4 text-sm w-[250px] mb-4'>
			<h2 className='text-2xl text-primaryAccentColor mb-4 bold'>Меню адміністратора</h2>
			<ul className='bg-secondaryBackground p-4 rounded-lg'>
				{menu.map(({ menuItemName, menuItemLink }, index) => {
					return (
						<li key={index} className='mb-3 nav'>
							<Link href={menuItemLink} className='flex justify-start items-start'>
								{menuItemName}
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default AdminMenu
