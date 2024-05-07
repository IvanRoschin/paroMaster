'use client'

import { useState } from 'react'

import Modal from './Modal'

import { useRouter } from 'next/navigation'

const CartModal = () => {
	const router = useRouter()

	const [isLoading, setIsLoading] = useState(false)

	const bodyContent = <div className='flex flex-col gap-4'></div>

	const footerContent = (
		<div className='flex flex-col gap-4 mt-3'>
			<hr />
		</div>
	)

	return (
		<Modal
			disabled={isLoading}
			title='Login'
			actionLabel='Continue'
			body={bodyContent}
			footer={footerContent}
		/>
	)
}

export default CartModal
