import Link from 'next/link'

interface LogoProps {
	color?: string
}

const Logo: React.FC<LogoProps> = ({ color }) => {
	return (
		<Link href='/' rel='noopener noreferrer' target='_self'>
			<div
				className={`text-4xl font-bold 
				${color ? 'text-white' : 'text-black'}`}
			>
				paro<span className='text-primaryAccentColor'>Master</span>
			</div>
		</Link>
	)
}

export default Logo
