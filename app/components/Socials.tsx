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
					href={`tel:${process.env.ADMIN_PHONE}`}
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

					<span
						className={`nav font-semibold
                        ${color ? 'text-white' : 'text-black'}

            `}
					>
						+380 97 744 09 79
					</span>
				</Link>
			</li>
			<li>
				{' '}
				<Link
					href={`mailto:${process.env.ADMIN_EMAIL}`}
					target='_blank'
					rel='noopener noreferrer'
					className={`flex items-center justify-start
				${color ? 'text-white' : 'text-black'}
        `}
				>
					<Icon
						name='lucide/email'
						className={`w-5 h-5 mr-3 hover:text-primaryAccentColor
            				${color ? 'text-white' : 'text-black'}

            `}
					/>
					<span
						className={`nav font-semibold
                        ${color ? 'text-white' : 'text-black'}

            `}
					>
						paromaster2@gmail.com
					</span>
				</Link>
			</li>
		</ul>
	)
}

export default Socials
