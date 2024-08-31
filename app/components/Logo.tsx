import Link from 'next/link'

interface LogoProps {
	color?: string
}

const Logo: React.FC<LogoProps> = ({ color }) => {
	return (
		<Link href='/' rel='noopener noreferrer' target='_self'>
			<div
				className={`text-4xl font-bold transition-colors duration-500 
				${
					color
						? 'text-primaryAccentColor group-hover:text-white'
						: 'text-white group-hover:text-primaryAccentColor'
				}
				rounded-lg group`}
			>
				<span
					className={`transition-colors duration-500 
					${color ? 'text-primaryAccentColor group-hover:text-white' : 'text-primaryAccentColor'} 
					group-hover:text-black`}
				>
					paro
				</span>
				<span
					className={`transition-colors duration-500 
					${color ? 'text-white' : 'text-black'} 
					group-hover:text-primaryAccentColor`}
				>
					Master
				</span>
			</div>
		</Link>
	)
}

export default Logo
