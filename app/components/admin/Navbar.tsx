'use client'
import { usePathname } from 'next/navigation'
import { MdNotifications, MdPublic } from 'react-icons/md'

const Navbar = () => {
	const pathname = usePathname()
	return (
		<div className='flex justify-between'>
			<div>{pathname.split('/').pop()}</div>
			<div className='flex justify-center items-center gap-5 '>
				<div className='flex'>
					{/* <Search /> */}
					{/* <input placeholder='Search...' className='flex items-center gap-3 p-2 bg-slate-400' /> */}
					<div className='flex'>
						<MdPublic size={20} />
						<MdNotifications size={20} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Navbar
