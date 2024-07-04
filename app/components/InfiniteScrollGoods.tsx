'use client'

import { getAllGoods } from '@/actions/goods'
import { IGood } from '@/types/good/IGood'
import { ISearchParams } from '@/types/searchParams'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { TailSpin } from 'react-loader-spinner'
import ItemsList from './Item/ItemsList'

const InfiniteScrollGods = ({
	searchParams,
	initialGoods,
	NUMBER_OF_GOODS_TO_FETCH,
}: {
	searchParams: ISearchParams
	initialGoods: IGood[]
	NUMBER_OF_GOODS_TO_FETCH: number
}) => {
	const [offset, setOffset] = useState(0)
	const [goods, setGoods] = useState<IGood[]>(initialGoods)
	const [allGoodsLoaded, setAllGoodsLoaded] = useState(false)
	const { ref, inView } = useInView()

	async function loadMoreGoods() {
		const newGoods = await getAllGoods(searchParams, offset, NUMBER_OF_GOODS_TO_FETCH)

		if (newGoods?.length) {
			setOffset(prevOffset => prevOffset + NUMBER_OF_GOODS_TO_FETCH)
			setGoods(prevGoods => [...prevGoods, ...newGoods])
		} else {
			setAllGoodsLoaded(true)
		}
	}

	useEffect(() => {
		if (inView && !allGoodsLoaded) {
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
					<p className='text-center py-10'>Це всі наявні Товари</p>
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
