import Navbar from '@/components/admin/Navbar'

type Props = {}

const layout = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	return (
		<div className='flex'>
			<div className='flex-1'></div>
			<div className='flex'>
				{/* <AdminSidebar /> */}
				{children}
				<Navbar />
			</div>
		</div>
	)
}

export default layout
