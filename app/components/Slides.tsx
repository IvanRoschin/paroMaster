import Image from 'next/image'
import { imagePaths } from './ImagesPaths'

export const slides = imagePaths.map(item => (
	<Image
		key={item.id}
		src={item.src}
		alt={item.title}
		width={400}
		height={400}
		className='w-full h-[80vh] object-cover md:rounded-tl-3xl md:rounded-bl-3xl'
	/>
))
