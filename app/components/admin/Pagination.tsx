type Props = {}

const Pagination = (props: Props) => {
	return (
		<div className='flex p-2 justify-between'>
			<button className='cursor-pointer px-1 py-2 disabled:cursor-not-allowed'>Prev</button>
			<button className='cursor-pointer px-1 py-2 disabled:cursor-not-allowed'>Next</button>
		</div>
	)
}

export default Pagination
