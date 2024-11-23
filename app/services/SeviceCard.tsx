import Image from 'next/image'

interface ServiceCardProps {
	id: number
	title: string
	desc: string
	conditions: string
	src: string
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ id, title, desc, conditions, src }) => {
	return (
		<div className='flex flex-col items-center p-6 bg-white rounded-lg shadow-md min-h-full'>
			<Image className='w-80 h-60 rounded-lg mb-4' src={src} alt={title} width={320} height={240} />
			<h3 className='subtitle'>{title}</h3>
			<p className='text-sm text-gray-700 text-center mb-4 leading-relaxed flex-grow'>{desc}</p>
			<p className='text-sm text-gray-500 text-center italic border-t pt-2'>{conditions}</p>
		</div>
	)
}
