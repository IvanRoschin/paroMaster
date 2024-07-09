import { getAllGoods } from '@/actions/goods'
import Pagination from '@/components/admin/Pagination'
import { Search } from '@/components/index'
import { ISearchParams } from '@/types/searchParams'
import Link from 'next/link'

type Props = {}

const ProductsPage = async ({ searchParams }: { searchParams: ISearchParams }) => {
	const goods = await getAllGoods(searchParams, 4, 0)
	const count = goods.count

	return (
		<div className='p-3 rounded-xl'>
			<div className='flex items-center justify-between'>
				<Search placeholder='Знайти товар' />
				<Link href='/admin/goods/add'>
					<button>Add New</button>
				</Link>
			</div>
			<table className='w-full'>
				<thead>
					<tr>
						<td className='p-2'>Category</td>
						<td className='p-2'>Title</td>
						<td className='p-2'>Brand</td>
						<td className='p-2'>Model</td>
						<td className='p-2'>Vendor</td>
						<td className='p-2'>Price</td>
						<td className='p-2'>isAvailable</td>
						<td className='p-2'>isCompatible</td>
						<td className='p-2'>Compatibility</td>
					</tr>
				</thead>
				<tbody>
					{goods.data.map(good => (
						<tr key={good._id}>
							<td className='p-2'>{good.category}</td>
							<td className='p-2'>{good.title}</td>
							<td className='p-2'>{good.brand}</td>
							<td className='p-2'>{good.model}</td>
							<td className='p-2'>{good.vendor}</td>
							<td className='p-2'>{good.price}</td>
							<td className='p-2'>{good.isAvailable}</td>
							<td className='p-2'>{good.isCompatible}</td>
							<td className='p-2'>{good.compatibility}</td>
							<td className='p-2'>
								<div className='flex gap-2'>
									<Link href={`/admin/goods/${good._id}`}>
										<button className='px-2 py-3 rounded-lg border-none cursor-pointer bg-teal-400'>
											View
										</button>
									</Link>
									<Link href={`/admin/goods/delete/${good._id}`}>
										<button className='px-2 py-3 rounded-lg border-none cursor-pointer bg-crimson-500'>
											Delete
										</button>
									</Link>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Pagination count={count} />
		</div>
	)
}

export default ProductsPage
