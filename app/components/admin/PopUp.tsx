interface PopUpProps {
	message: string
	onClose: () => void
}

const PopUp: React.FC<PopUpProps> = ({ message, onClose }) => {
	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-white p-5 rounded shadow-md flex flex-col justify-center items-center'>
				<h3 className='text-lg'>{message}</h3>
				<button
					className='mt-4 bg-primaryAccentColor text-white py-1 px-3 rounded'
					onClick={onClose}
				>
					Закрити
				</button>
			</div>
		</div>
	)
}

export default PopUp
