'use client'

import { IGood } from '@/types/good/IGood'
import Image from 'next/image'
import { useState } from 'react'

interface ImagesBlockProps {
	item?: IGood
}

const ImagesBlock: React.FC<ImagesBlockProps> = ({ item }) => {
	const [index, setIndex] = useState<number>(0)
	console.log('item', item)

	return (
		<div className='mr-[50px] pb-[40px]'>
			{item?.imgUrl && item.imgUrl.length > 0 && (
				<div className='w-[400px] h-[400px]'>
					<Image
						src={item.imgUrl[index]}
						alt='item_photo'
						width={400}
						height={400}
						className='self-center mb-[30px]'
					/>
				</div>
			)}

			{item?.imgUrl && item.imgUrl.length > 0 && (
				<ul className='grid grid-cols-3 gap-3'>
					{item.imgUrl.map((img: string, imgIndex: number) => (
						<li key={imgIndex}>
							<Image
								src={img}
								alt='item another look'
								width={120}
								height={120}
								className='border border-gray-400 block cursor-pointer hover:shadow-[10px_10px_15px_-3px_rgba(0,0,0,0.3)] hover:scale-105 transition-all'
								onClick={() => setIndex(imgIndex)}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default ImagesBlock
