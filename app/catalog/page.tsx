import { getAllGoods } from '@/actions/goods'
import InfiniteScrollGoods from '@/components/InfiniteScrollGoods'
import { IGood } from '@/types/index'
import { ISearchParams } from '@/types/searchParams'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

interface GoodsData {
	goods: IGood[]
}

const limit = 4

export default async function CatalogPage({ searchParams }: { searchParams: ISearchParams }) {
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ['goods'],
		queryFn: () => getAllGoods(searchParams, limit),
	})
	const queryState = queryClient.getQueryState(['goods'])

	const goods = (queryState?.data as GoodsData)?.goods || []

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className='container'>
				<h2 className='title mb-1'>Каталог товарів</h2>
				<div key={Math.random()}>
					<InfiniteScrollGoods initialGoods={goods} searchParams={searchParams} limit={limit} />
				</div>
			</div>
		</HydrationBoundary>
	)
}
