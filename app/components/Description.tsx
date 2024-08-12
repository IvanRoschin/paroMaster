import { motion } from 'framer-motion'
// import left from '../public/left.svg'
// import right from '../public/right.svg'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'
import Button from './Button'
import { slides } from '../config/constants'

type Props = {
	activeImage: any
	clickNext: any
	clickPrev: any
}

const Description = ({ activeImage, clickNext, clickPrev }: Props) => {
	return (
		<div className='grid place-items-start w-full bg-white relative md:rounded-tr-3xl md:rounded-br-3xl'>
			<div className='uppercase text-sm absolute right-4 top-2 underline-offset-4 underline'></div>
			{slides.map((elem, idx) => (
				<div
					key={idx}
					className={`${
						idx === activeImage ? 'block w-full  py-10 md:px-20 px-10 text-left' : 'hidden'
					}`}
				>
					<motion.div
						initial={{
							opacity: idx === activeImage ? 0 : 0.5,
							scale: idx === activeImage ? 0.5 : 0.3,
						}}
						animate={{
							opacity: idx === activeImage ? 1 : 0.5,
							scale: idx === activeImage ? 1 : 0.3,
						}}
						transition={{
							ease: 'linear',
							duration: 2,
							x: { duration: 1 },
						}}
						className='w-full relative'
					>
						<div className='py-16 text-5xl font-extrabold'>{elem.title}</div>
						<div className='leading-relaxed font-medium text-base tracking-wide h-60 md:h-40 italic text-gray-600'>
							{' '}
							{elem.desc}
						</div>
						<div className='absolute bottom-0 left-20'>
							<Button type={'button'} label='Замовити' />
						</div>
					</motion.div>

					{/* <button className='bg-[#ecae7e] text-white uppercase px-4 py-2 rounded-md my-10'>
						order now
					</button> */}
					<div className='absolute md:bottom-1 bottom-10 right-10 md:right-0 w-full flex justify-center items-center'>
						<div className='absolute bottom-2 right-10 cursor-pointer' onClick={clickPrev}>
							{/* <Image src={left} alt='' /> */}
							<div className='swiper-button-prev'>
								<IoIosArrowDropleft />
							</div>{' '}
						</div>

						<div className='absolute bottom-2 right-2 cursor-pointer' onClick={clickNext}>
							<div className='swiper-button-next'>
								<IoIosArrowDropright />
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default Description
