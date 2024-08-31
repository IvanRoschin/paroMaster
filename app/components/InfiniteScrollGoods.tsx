'use client'

import { getAllGoods } from '@/actions/goods'
import { IGood } from '@/types/good/IGood'
import { ISearchParams } from '@/types/searchParams'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { TailSpin } from 'react-loader-spinner'
import ItemsList from './Item/ItemsList'

const InfiniteScrollGods = ({
	search,
	initialGoods,
	NUMBER_OF_GOODS_TO_FETCH,
}: {
	search: ISearchParams
	initialGoods: IGood[]
	NUMBER_OF_GOODS_TO_FETCH: number
}) => {
	const [goods, setGoods] = useState<IGood[]>(initialGoods)
	const [pagesLoaded, setPagesLoaded] = useState(1)
	const [allGoodsLoaded, setAllGoodsLoaded] = useState(false)
	const { ref, inView } = useInView()

	async function loadMoreGoods() {
		const nextPage = pagesLoaded + 1
		const newGoods = (await getAllGoods(search, NUMBER_OF_GOODS_TO_FETCH, nextPage)) ?? []

		if (newGoods?.goods?.length > 0) {
			setGoods((prevGoods: IGood[]) => [...prevGoods, ...newGoods.goods])
			setPagesLoaded(nextPage)
		} else {
			setAllGoodsLoaded(true)
		}
	}

	useEffect(() => {
		if (inView) {
			loadMoreGoods()
		}
	}, [inView])

	return (
		<>
			<section>
				<ItemsList goods={goods} />
			</section>
			<section>
				{allGoodsLoaded ? (
					<p className=' subtitle mb-4 text-center py-10'> Це всі 🤷‍♂️ наявні Товари 🛒</p>
				) : (
					<div ref={ref} className='flex items-center justify-center py-10'>
						<TailSpin
							visible={true}
							height='40'
							width='40'
							color='#ea580c'
							ariaLabel='tail-spin-loading'
							radius='1'
							wrapperStyle={{}}
							wrapperClass=''
						/>
					</div>
				)}
			</section>
		</>
	)
}

export default InfiniteScrollGods
