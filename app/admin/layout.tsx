import Navbar from '@/components/admin/Navbar'
import Sidebar from '@/components/admin/Sidebar'

type Props = {}

const layout = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	return (
		<div className='flex'>
			<div className='flex-1'>
				<Navbar />
			</div>
			<div>
				<Sidebar />
				{children}
			</div>
		</div>
	)
}

export default layout
