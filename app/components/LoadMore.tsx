'use client'

import { getAllGoods } from '@/actions/goods'
import { IItem } from '@/types/item/IItem'
import { ISearchParams } from '@/types/searchParams'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { TailSpin } from 'react-loader-spinner'
import ItemsList from './Item/ItemsList'

const LoadMore = ({ searchParams }: { searchParams: ISearchParams }) => {
	const [goods, setGoods] = useState<IItem[]>([])
	const [offset, setOffset] = useState(0)

	const { ref, inView } = useInView({
		threshold: 0,
	})
	const NUMBER_OF_GOODS_TO_FETCH = 4

	useEffect(() => {
		const fetchData = async () => {
			if (inView) {
				const data = await getAllGoods(searchParams, offset)
				setGoods(prevGoods => [...prevGoods, ...data])
				setOffset(prevOffset => prevOffset + NUMBER_OF_GOODS_TO_FETCH)
			}
		}

		fetchData()
	}, [inView, searchParams, offset])

	return (
		<>
			<section>
				<ItemsList goods={goods} />
			</section>
			<section>
				<div ref={ref}>
					<TailSpin
						visible={true}
						height='80'
						width='80'
						color='#4fa94d'
						ariaLabel='tail-spin-loading'
						radius='1'
						wrapperStyle={{}}
						wrapperClass=''
					/>
				</div>
			</section>
		</>
	)
}

export default LoadMore
