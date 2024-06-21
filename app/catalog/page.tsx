import { getAllGoods } from '@/actions/goods'
import InfiniteScrollGoods from '@/components/InfiniteScrollGoods'
import { ISearchParams } from '@/types/searchParams'

const NUMBER_OF_GOODS_TO_FETCH = 4

const Page = async ({ searchParams }: { searchParams: ISearchParams }) => {
	const goods = await getAllGoods(searchParams, 0, NUMBER_OF_GOODS_TO_FETCH)

	return (
		<div>
			<h2 className='text-4xl mb-4 flex justify-start items-start'>Каталог товарів</h2>
			<InfiniteScrollGoods
				initialGoods={goods}
				searchParams={searchParams}
				NUMBER_OF_GOODS_TO_FETCH={NUMBER_OF_GOODS_TO_FETCH}
			/>
		</div>
	)
}

export default Page
