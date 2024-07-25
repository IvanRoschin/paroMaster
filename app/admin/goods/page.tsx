import { getAllGoods } from '@/actions/goods'
import Pagination from '@/components/admin/Pagination'
import Button from '@/components/Button'
import { Search } from '@/components/index'
import { ISearchParams } from '@/types/searchParams'
import Link from 'next/link'

type Props = {}

const ProductsPage = async ({ searchParams }: { searchParams: ISearchParams }) => {
	const data = await getAllGoods(searchParams, 4, 0)
	const count = data.count

	return (
		<div className='p-3 rounded-xl'>
			<div className='flex items-center justify-between'>
				<Search placeholder='Знайти товар' />
				<Link href='/admin/goods/add'>
					<Button type={'submit'} label='Додати' small outline />
				</Link>
			</div>
			<table className='w-full'>
				<thead className='bg-teal-400'>
					<tr>
						<td className='p-2'>Категорія</td>
						<td className='p-2'>Назва</td>
						<td className='p-2'>Бренд</td>
						<td className='p-2'>Модель</td>
						<td className='p-2'>Vendor</td>
						<td className='p-2'>Ціна</td>
						<td className='p-2'>Редагувати</td>
						<td className='p-2'>Видалити</td>
					</tr>
				</thead>
				<tbody>
					{data.goods.map(good => (
						<tr key={good._id}>
							<td className='p-2'>{good.category}</td>
							<td className='p-2'>{good.title}</td>
							<td className='p-2'>{good.brand}</td>
							<td className='p-2'>{good.model}</td>
							<td className='p-2'>{good.vendor}</td>
							<td className='p-2'>{good.price}</td>
							<td className='p-2'>
								<div className='flex gap-2'>
									<Link href={`/admin/goods/${good._id}`}>
										<Button type={'submit'} label='Див' small outline />
									</Link>
								</div>
							</td>
							<td>
								{' '}
								<Link href={`/admin/goods/delete/${good._id}`}>
									<Button type={'submit'} label='Видалити' small outline />
								</Link>
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
