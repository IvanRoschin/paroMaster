import Link from 'next/link'
import { Icon } from './Icon'

interface SocialsProps {
	color?: string
}

const Socials: React.FC<SocialsProps> = ({ color }) => {
	return (
		<ul className=''>
			<li>
				<Link
					href='tel:+380977440979'
					target='_blank'
					rel='noopener noreferrer'
					className={`flex items-center justify-start
				${color ? 'text-white' : 'text-black'}
        `}
				>
					<Icon
						name='lucide/phone'
						className={`w-5 h-5 mr-3 hover:text-primaryAccentColor
            				${color ? 'text-white' : 'text-black'}

            `}
					/>
					<Icon
						name='lucide/viber'
						className={`w-5 h-5 mr-1 hover:text-primaryAccentColor 
         ${color ? 'text-white' : 'text-black'}
            `}
					/>
					<span
						className={`nav font-semibold
                        ${color ? 'text-white' : 'text-black'}

            `}
					>
						+38 097 744 09 79
					</span>
				</Link>
			</li>
		</ul>
	)
}

export default Socials
