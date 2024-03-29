import Link from 'next/link'

type Props = {}

const Logo = (props: Props) => {
	return (
		<Link href='/' rel='noopener noreferrer' target='_self'>
			<div className='text-4xl font-bold'>
				paro<span className='text-primaryAccentColor'>Master</span>
			</div>
		</Link>
	)
}

export default Logo
