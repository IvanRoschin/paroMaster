import Button from '@/components/Button'
import Pagination from '@/components/admin/Pagination'
import { Search } from '@/components/index'
import Link from 'next/link'

type Props = {}

const ProductsPage = (props: Props) => {
	return (
		<div className='p-3 rounded-xl'>
			<div className='flex items-center justify-between'>
				<Search placeholder='Знайти товар' />
				<Link href='/admin/goods/add'>
					<Button label={'додати'} small />
				</Link>
			</div>
			<table className='w-full'>
				<thead>
					<tr>
						<td className='p-2'>Name</td>
						<td className='p-2'>Email</td>
						<td className='p-2'>Created At</td>
						<td className='p-2'>Role</td>
						<td className='p-2'>Status</td>
						<td className='p-2'>Actions</td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className='p-2'>John Doe</td>
						<td className='p-2'>johndoe@gmail.com</td>
						<td className='p-2'>01.01.2024</td>
						<td className='p-2'>admin</td>
						<td className='p-2'>active</td>
						<td className='p-2'>
							<div className='flex gap-2'>
								<Link href='/admin/goods/add'>
									<button className='px-2 py-3 rounded-lg border-none cursor-pointer bg-teal-400'>
										View
									</button>
								</Link>
								<Link href='/admin/users/add'>
									<button className='px-2 py-3 rounded-lg border-none cursor-pointer bg-crimson-500'>
										Delete
									</button>
								</Link>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<Pagination />
		</div>
	)
}

export default ProductsPage
